// Imports the HedgeDoc notes listed in src/content/hedgedoc-urls.txt into
// src/content/<section>/<slug>/index.md, with their images in assets/.
// Notes with `type: home-image-filler` are Home image fillers: they are validated and written
// to src/content/home-image-fillers/<note id>/index.md.
// The rules are documented in CLAUDE.md, under "Content".
//
//   npm run syncFromHedgeDoc                        import the notes that are missing
//   npm run syncFromHedgeDoc -- --dry-run           show what would happen, write nothing
//   npm run syncFromHedgeDoc -- --force <path>      re-import one page, e.g. events/<slug>

import { mkdir, readFile, readdir, rm, rmdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { isMap, parseDocument } from 'yaml';

const HEDGEDOC = 'https://pad.dsl.unibe.ch';
const HEDGEDOC_HOST = new URL(HEDGEDOC).hostname;
const CONTENT_DIR = fileURLToPath(new URL('../src/content/', import.meta.url));
const URL_LIST = path.join(CONTENT_DIR, 'hedgedoc-urls.txt');

const SECTIONS = {
	event: 'events',
	publication: 'publications',
	artifact: 'artifacts',
	about: 'about',
	team: 'about/team',
	'home-image-filler': 'home-image-fillers'
};
const FALLBACK_TYPE = 'about';
const FILLER_SECTION = SECTIONS['home-image-filler'];
const FILLER_ACCENTS = ['about', 'event', 'publication', 'artifact'];
const SLUG_MAX_LENGTH = 60;
const NOTE_TIMEOUT_MS = 15_000;
const IMAGE_TIMEOUT_MS = 60_000;
// With these options, yaml writes an unchanged front matter back byte for byte.
const YAML_OPTIONS = { lineWidth: 0, indentSeq: false };

const EXTENSION_BY_TYPE = {
	'image/avif': '.avif',
	'image/bmp': '.bmp',
	'image/gif': '.gif',
	'image/jpeg': '.jpg',
	'image/png': '.png',
	'image/svg+xml': '.svg',
	'image/tiff': '.tif',
	'image/webp': '.webp',
	'image/x-icon': '.ico'
};
const IMAGE_EXTENSIONS = new Set([...Object.values(EXTENSION_BY_TYPE), '.jpeg', '.tiff']);
const SPECIAL_LETTERS = { ß: 'ss', æ: 'ae', œ: 'oe', ø: 'o', ł: 'l', đ: 'd', þ: 'th' };
// Top-level HedgeDoc paths that are not notes.
const RESERVED_PATHS = new Set(['s', 'p', 'new', 'uploads', 'login', 'logout', 'me', 'history', 'status', 'config']);

const FRONT_MATTER = /^---[ \t]*\r?\n(?:([\s\S]*?)\r?\n)?---[ \t]*(?:\r?\n|$)/;

const USAGE = `Usage:
  npm run syncFromHedgeDoc                     import the notes listed in src/content/hedgedoc-urls.txt
  npm run syncFromHedgeDoc -- --dry-run        show what would happen without writing anything
  npm run syncFromHedgeDoc -- --force <path>   re-import a page; <path> is relative to src/content, e.g. events/<slug>`;

class NetworkError extends Error {
	constructor(reason, url) {
		super(`${reason} (${url})`);
		this.reason = reason;
		this.url = url;
	}
}

class HostUnreachableError extends Error {}

const report = {
	added: [],
	reimported: [],
	skipped: [],
	conflicts: [],
	errors: [],
	warnings: [],
	images: [],
	failedImages: [],
	noteLinks: [],
	unlisted: []
};

process.exitCode = await main();

async function main() {
	let options;
	try {
		options = parseArgs(process.argv.slice(2));
	} catch (error) {
		console.error(`${error.message}\n\n${USAGE}`);
		return 1;
	}
	if (options.help) {
		console.log(USAGE);
		return 0;
	}

	console.log(`HedgeDoc sync${options.dryRun ? ' (dry run: nothing is written)' : ''}\n`);
	const pages = await indexPages();
	const jobs = options.force.length ? forceJobs(options.force, pages) : await listJobs();
	const importedAt = new Date().toISOString().replace(/\.\d+Z$/, 'Z');

	for (const [index, job] of jobs.entries()) {
		console.log(`[${index + 1}/${jobs.length}] ${job.label}`);
		try {
			await processJob(job, pages, { ...options, importedAt });
		} catch (error) {
			if (error instanceof HostUnreachableError) {
				report.errors.push(error.message);
				const left = jobs.length - index;
				console.log(`      ${error.message}\n      Stopped: ${left} note(s) not processed.`);
				break;
			}
			report.errors.push(`${job.label}: ${error.message}`);
			console.log(`      error: ${error.message}`);
		}
	}
	if (!options.force.length) findUnlistedPages(pages, jobs);

	printSummary(options.dryRun);
	return report.errors.length || report.conflicts.length || report.failedImages.length ? 1 : 0;
}

function parseArgs(args) {
	// `npm run syncFromHedgeDoc --dry-run` (without `--`) hands the flag to npm, which only sets
	// npm_config_dry_run; the same goes for --force, whose path still reaches the script.
	const npmForce = process.env.npm_config_force === 'true';
	const options = { dryRun: process.env.npm_config_dry_run === 'true', force: [], help: false };
	for (let i = 0; i < args.length; i++) {
		const arg = args[i];
		if (arg === '--dry-run') options.dryRun = true;
		else if (arg === '--help' || arg === '-h') options.help = true;
		else if (arg === '--force') {
			if (!args[i + 1] || args[i + 1].startsWith('--')) throw new Error('--force needs a path.');
			options.force.push(args[++i]);
		} else if (arg.startsWith('--force=')) options.force.push(arg.slice('--force='.length));
		else if (npmForce && !arg.startsWith('-')) options.force.push(arg);
		else throw new Error(`Unknown argument: ${arg}`);
	}
	if (npmForce && !options.force.length) throw new Error('--force needs a path.');
	return options;
}

// ---------------------------------------------------------------------------
// Jobs

async function listJobs() {
	let text;
	try {
		text = await readFile(URL_LIST, 'utf8');
	} catch (error) {
		if (error.code !== 'ENOENT') throw error;
		report.errors.push(`${relative(URL_LIST)} does not exist.`);
		return [];
	}
	const jobs = [];
	for (const [index, raw] of text.split(/\r?\n/).entries()) {
		const line = raw.trim();
		if (!line || line.startsWith('#')) continue;
		const ref = parseNoteUrl(line);
		if (ref) jobs.push({ label: line, ref });
		else report.errors.push(`${relative(URL_LIST)}, line ${index + 1}: not a note URL on ${HEDGEDOC}: ${line}`);
	}
	return jobs;
}

function forceJobs(paths, pages) {
	const jobs = [];
	for (const given of paths) {
		const dir = pageDir(given);
		const page = dir && pages.byDir.get(dir);
		const ref = page?.source && parseNoteUrl(page.source);
		if (!dir) report.errors.push(`--force ${given}: not a page path inside src/content.`);
		else if (!page) report.errors.push(`--force ${given}: src/content/${dir}/index.md does not exist.`);
		else if (!page.source) report.errors.push(`--force ${given}: the page has no source:, so it is hand-written and never touched.`);
		else if (!ref?.id) report.errors.push(`--force ${given}: source: ${page.source} is not a HedgeDoc note URL.`);
		else jobs.push({ label: `--force ${dir}`, ref, force: dir });
	}
	return jobs;
}

/** Reports imported pages whose link is no longer in the list. They are kept, never deleted. */
function findUnlistedPages(pages, jobs) {
	const imported = [...pages.byDir].filter(([, page]) => page.source);
	if (!imported.length) return;
	if (jobs.some((job) => !job.source)) {
		report.warnings.push('Could not check for pages removed from the list: some links were not resolved.');
		return;
	}
	const listed = new Set(jobs.map((job) => job.source));
	for (const [dir, page] of imported) {
		if (!listed.has(page.source)) report.unlisted.push({ dir, source: page.source });
	}
}

/** Normalizes a --force argument to a page folder relative to src/content, e.g. "events/<slug>". */
function pageDir(given) {
	let dir = path.posix.normalize(given.replaceAll('\\', '/'));
	dir = dir.replace(/^\.\//, '').replace(/^src\/content\//, '').replace(/(\/index\.md|\/)$/, '');
	if (!dir || dir === '.' || dir.startsWith('..') || path.posix.isAbsolute(dir)) return null;
	return dir;
}

async function processJob(job, pages, { dryRun, importedAt }) {
	const id = job.ref.id ?? (await resolveShortId(job.ref.shortid));
	const source = canonicalSource(id);
	job.source = source;

	const present = pages.bySource.get(source);
	if (present && !job.force) {
		report.skipped.push({ dir: present, source });
		console.log(`      already present: ${pagePath(present)}`);
		return;
	}

	const note = parseNote(await fetchNote(id));
	const { section, warning } = sectionFor(note.doc.get('type'));
	if (warning) report.warnings.push(`${source}: ${warning}`);
	// Fillers have no title: their folder is named after the note id, which never changes.
	const filler = section === FILLER_SECTION;
	const dir = `${section}/${filler ? slugify(id) : slugFor(note.doc, id)}`;
	if (filler) validateFiller(note, dir, pages);

	const occupant = pages.byDir.get(dir);
	if (occupant && occupant.source !== source) {
		const reason = occupant.source
			? `it was imported from ${occupant.source}`
			: 'it is hand-written (no source:)';
		report.conflicts.push({ dir, source, reason });
		console.log(`      conflict: ${pagePath(dir)} already exists and ${reason}. Add slug: to the note to pick another URL.`);
		return;
	}
	if (!occupant && (await hasEntries(path.join(CONTENT_DIR, dir, 'assets')))) {
		const reason = 'its folder already has an assets/ folder but no index.md';
		report.conflicts.push({ dir, source, reason });
		console.log(`      conflict: ${pagePath(dir)}: ${reason}.`);
		return;
	}

	const images = await localizeImages(note, dir, dryRun);
	for (const url of findNoteLinks(note.body)) report.noteLinks.push({ dir, url });

	note.doc.set('source', source);
	note.doc.set('importedAt', importedAt);
	const body = note.body.endsWith('\n') ? note.body : `${note.body}\n`;
	const markdown = `---\n${note.doc.toString(YAML_OPTIONS)}---\n${body}`;

	const moved = job.force && job.force !== dir ? job.force : null;
	if (!dryRun) {
		await writePage(dir, markdown, images, { replace: Boolean(job.force) });
		if (moved) await removePage(moved);
	}

	if (moved) pages.byDir.delete(moved);
	pages.byDir.set(dir, { source, position: note.doc.get('position') });
	pages.bySource.set(source, dir);

	const verb = dryRun ? 'would ' : '';
	const details = filler ? ` (accent ${note.doc.get('accent')}, position ${note.doc.get('position')})` : '';
	if (job.force) {
		report.reimported.push({ dir, source, movedFrom: moved });
		console.log(`      ${verb}re-import ${pagePath(dir)}${details}${moved ? `, moved from ${pagePath(moved)}` : ''}`);
	} else {
		report.added.push({ dir, source });
		console.log(`      ${verb}add ${pagePath(dir)}${details}`);
	}
}

// ---------------------------------------------------------------------------
// HedgeDoc

/** Returns { id } for https://pad…/<id>, { shortid } for https://pad…/s/<shortid>, or null. */
function parseNoteUrl(text) {
	let url;
	try {
		url = new URL(text);
	} catch {
		return null;
	}
	if (url.hostname !== HEDGEDOC_HOST) return null;
	const parts = url.pathname.split('/').filter(Boolean);
	if (parts.length === 2 && parts[0] === 's') return { shortid: parts[1] };
	if (parts.length === 1 && !RESERVED_PATHS.has(parts[0])) return { id: parts[0] };
	return null;
}

function canonicalSource(id) {
	return `${HEDGEDOC}/${id}`;
}

/** Published notes (/s/<shortid>) redirect from /s/<shortid>/edit to the note itself. */
async function resolveShortId(shortid) {
	const url = `${HEDGEDOC}/s/${shortid}/edit`;
	const response = await requestHedgeDoc(url, { redirect: 'manual' });
	const location = response.headers.get('location');
	if (response.status === 404) throw new Error(`published note not found: ${HEDGEDOC}/s/${shortid}`);
	if (response.status < 300 || response.status > 399 || !location) {
		throw new Error(`${url} did not redirect to the note (HTTP ${response.status}).`);
	}
	const ref = parseNoteUrl(new URL(location, HEDGEDOC).href);
	if (!ref?.id) throw new Error(`${url} redirected to ${location}, which is not a note.`);
	return ref.id;
}

async function fetchNote(id) {
	const url = `${canonicalSource(id)}/download`;
	const response = await requestHedgeDoc(url);
	if (response.status === 404) throw new Error(`note not found: ${canonicalSource(id)}`);
	if (!response.ok) throw new Error(`HTTP ${response.status} from ${url}`);
	if (response.headers.get('content-type')?.includes('text/html')) {
		throw new Error(`${url} returned a web page instead of Markdown: the note may not be public.`);
	}
	return response.text();
}

async function request(url, { timeout, ...init }) {
	try {
		return await fetch(url, { ...init, signal: AbortSignal.timeout(timeout) });
	} catch (error) {
		const reason =
			error.name === 'TimeoutError'
				? `no answer within ${timeout / 1000} s`
				: (error.cause?.code ?? error.cause?.message ?? error.message);
		throw new NetworkError(reason, url);
	}
}

/** Like request(), but a network failure means the whole HedgeDoc server is unreachable. */
async function requestHedgeDoc(url, init = {}) {
	try {
		return await request(url, { timeout: NOTE_TIMEOUT_MS, ...init });
	} catch (error) {
		if (!(error instanceof NetworkError)) throw error;
		throw new HostUnreachableError(
			`Cannot reach ${HEDGEDOC}: ${error.reason}. ` +
				'The server may only be reachable from the University of Bern network: ' +
				'connect to it (or to its VPN) and run the script again.'
		);
	}
}

// ---------------------------------------------------------------------------
// Front matter, section and slug

function parseNote(markdown) {
	const match = markdown.match(FRONT_MATTER);
	const doc = parseDocument(match?.[1] ?? '');
	if (doc.errors.length) throw new Error(`invalid front matter: ${doc.errors[0].message}`);
	if (doc.contents !== null && !isMap(doc.contents)) throw new Error('the front matter is not a list of fields.');
	return { doc, body: match ? markdown.slice(match[0].length) : markdown };
}

function sectionFor(type) {
	const key = type == null ? '' : String(type).toLowerCase().replace(/\s+/g, '');
	if (Object.hasOwn(SECTIONS, key)) return { section: SECTIONS[key] };
	const problem = key ? `unknown type "${type}"` : 'no type';
	return { section: SECTIONS[FALLBACK_TYPE], warning: `${problem}, filed under "${FALLBACK_TYPE}".` };
}

function slugFor(doc, id) {
	for (const candidate of [doc.get('slug'), doc.get('title'), id]) {
		const slug = candidate == null ? '' : slugify(String(candidate));
		if (slug) return slug;
	}
	return id;
}

function slugify(text) {
	const slug = stripMarkdown(text)
		.toLowerCase()
		.normalize('NFKD')
		.replace(/\p{M}+/gu, '')
		.replace(/[ßæœøłđþ]/g, (letter) => SPECIAL_LETTERS[letter])
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
	if (slug.length <= SLUG_MAX_LENGTH) return slug;
	const cut = slug.lastIndexOf('-', SLUG_MAX_LENGTH);
	return cut > 0 ? slug.slice(0, cut) : slug.slice(0, SLUG_MAX_LENGTH);
}

function stripMarkdown(text) {
	return text
		.replace(/!?\[([^\]]*)\](?:\([^)]*\)|\[[^\]]*\])/g, '$1') // links and images keep their text
		.replace(/<[^>]*>/g, '') // HTML tags
		.replace(/\\(.)/g, '$1') // backslash escapes
		.replace(/[*~`]/g, ''); // emphasis, strikethrough and code markers
}

// ---------------------------------------------------------------------------
// Home image fillers

/**
 * Checks a Home image filler that would be written to `dir`, and throws an error that says
 * what to fix in the note. Its position must not be taken by another filler.
 */
function validateFiller(note, dir, pages) {
	const problems = [];
	const accent = note.doc.get('accent');
	if (!FILLER_ACCENTS.includes(accent)) {
		problems.push(`accent must be one of ${FILLER_ACCENTS.join(', ')} (found ${describe(accent)})`);
	}
	const position = note.doc.get('position');
	if (!Number.isInteger(position) || position < 1) {
		problems.push(`position must be a whole number from 1 up (found ${describe(position)})`);
	} else {
		for (const [other, page] of pages.byDir) {
			if (other !== dir && other.startsWith(`${FILLER_SECTION}/`) && page.position === position) {
				const owner = page.source ? ` (${page.source})` : '';
				problems.push(`position ${position} is already taken by ${pagePath(other)}${owner}; pick a free position`);
			}
		}
	}

	const images = findImageUrls(note.body);
	if (images.length !== 1) {
		problems.push(`the body must hold exactly one image, but it has ${images.length || 'none'}`);
	} else if (images[0].kind !== 'inline') {
		problems.push('the image must be written as ![alt text](url "caption")');
	} else {
		const [image] = images;
		if (!image.alt.trim()) problems.push('the image has no alt text');
		const rest = (note.body.slice(0, image.image.start) + note.body.slice(image.image.end)).trim();
		if (rest) problems.push(`the body must hold only the image, but it also has "${excerpt(rest)}"`);
	}

	if (problems.length) {
		throw new Error(`invalid home image filler: ${problems.join('; ')}. Fix the note on HedgeDoc and run the script again.`);
	}
}

function describe(value) {
	return value === undefined ? 'nothing' : JSON.stringify(value);
}

function excerpt(text) {
	const flat = text.replace(/\s+/g, ' ');
	return flat.length > 60 ? `${flat.slice(0, 60)}…` : flat;
}

// ---------------------------------------------------------------------------
// Images

/**
 * Downloads the images of a note and points their links to ./assets/<file>.
 * Rewrites note.body in place and returns the files to write. In a dry run, downloads nothing.
 */
async function localizeImages(note, dir, dryRun) {
	const spans = findImageUrls(note.body);
	const byUrl = new Map(); // resolved URL -> file name, or null if it failed
	const usedNames = new Set();
	const files = [];
	const target = `${pagePath(dir, 'assets')}/`;

	for (const span of spans) {
		const url = resolveImageUrl(span.raw);
		if (!url || byUrl.has(url)) continue;
		if (dryRun) {
			const file = fileNameFor(url, null, usedNames);
			byUrl.set(url, file);
			report.images.push({ file: target + file, url });
			continue;
		}
		try {
			const { data, type } = await downloadImage(url);
			const file = fileNameFor(url, type, usedNames);
			byUrl.set(url, file);
			files.push({ file, data });
			report.images.push({ file: target + file, url, size: data.length });
		} catch (error) {
			byUrl.set(url, null);
			report.failedImages.push({ dir, url, reason: error.message });
			console.log(`      image not downloaded, link kept: ${url} (${error.message})`);
		}
	}

	// Replace from the end so that the earlier offsets stay valid.
	for (const span of [...spans].sort((a, b) => b.start - a.start)) {
		const file = byUrl.get(resolveImageUrl(span.raw));
		if (file) note.body = note.body.slice(0, span.start) + `./assets/${file}` + note.body.slice(span.end);
	}
	return files;
}

async function downloadImage(url) {
	const response = await request(url, { timeout: IMAGE_TIMEOUT_MS });
	if (!response.ok) throw new Error(`HTTP ${response.status}`);
	const type = response.headers.get('content-type')?.split(';')[0].trim().toLowerCase() ?? '';
	const extension = path.extname(new URL(url).pathname).toLowerCase();
	const looksLikeImage =
		type.startsWith('image/') || (type === 'application/octet-stream' && IMAGE_EXTENSIONS.has(extension));
	if (!looksLikeImage) throw new Error(`not an image (${type || 'no content type'})`);
	return { data: Buffer.from(await response.arrayBuffer()), type };
}

/** Resolves an image URL as written in Markdown or HTML; null for URLs that are not downloadable. */
function resolveImageUrl(raw) {
	const unescaped = raw.replace(/\\([!-/:-@[-`{-~])/g, '$1').replaceAll('&amp;', '&');
	try {
		const url = new URL(unescaped, `${HEDGEDOC}/`);
		return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : null;
	} catch {
		return null;
	}
}

/** A safe, unique file name based on the last segment of the URL. */
function fileNameFor(url, type, usedNames) {
	let base = path.posix.basename(new URL(url).pathname);
	try {
		base = decodeURIComponent(base);
	} catch {
		// Keep the encoded name.
	}
	let extension = path.extname(base).toLowerCase();
	let stem = base.slice(0, base.length - extension.length);
	if (!IMAGE_EXTENSIONS.has(extension)) {
		stem = base;
		extension = EXTENSION_BY_TYPE[type] ?? '';
	}
	stem =
		stem
			.normalize('NFKD')
			.replace(/\p{M}+/gu, '')
			.replace(/[^A-Za-z0-9_-]+/g, '-')
			.replace(/^-+|-+$/g, '')
			.slice(0, 80) || 'image';
	let name = `${stem}${extension}`;
	for (let n = 2; usedNames.has(name.toLowerCase()); n++) name = `${stem}-${n}${extension}`;
	usedNames.add(name.toLowerCase());
	return name;
}

/**
 * Finds the image URLs in a Markdown body: inline images ![alt](url "title"), also with the
 * HedgeDoc size syntax (url =WxH), reference definitions [id]: url used by images, and
 * <img src="…">. Code blocks, code spans and HTML comments are ignored.
 * Returns [{ kind, start, end, raw }], where kind is inline, reference or tag and start and end
 * delimit the URL in the body. Inline images also have `alt` and `image`, the offsets of the whole image.
 */
function findImageUrls(body) {
	const text = maskCode(body);
	const spans = [];
	const imageLabels = new Set();

	for (let i = text.indexOf('!['); i !== -1; i = text.indexOf('![', i)) {
		const altEnd = isEscaped(text, i) ? -1 : closingBracket(text, i + 1);
		if (altEnd === -1) {
			i += 2;
			continue;
		}
		if (text[altEnd + 1] === '(') {
			const inline = parseInlineDestination(text, altEnd + 2);
			if (inline) {
				if (inline.end > inline.start) {
					const image = { start: i, end: inline.close };
					spans.push({ kind: 'inline', start: inline.start, end: inline.end, image, alt: body.slice(i + 2, altEnd) });
				}
				i = inline.close;
				continue;
			}
		}
		// Reference images: ![alt][label], ![alt][] and ![alt].
		let label = text.slice(i + 2, altEnd);
		if (text[altEnd + 1] === '[') {
			const labelEnd = closingBracket(text, altEnd + 1);
			if (labelEnd !== -1 && text.slice(altEnd + 2, labelEnd).trim()) label = text.slice(altEnd + 2, labelEnd);
		}
		imageLabels.add(normalizeLabel(label));
		i = altEnd + 1;
	}

	const definition = /^ {0,3}\[((?:[^\]\\\n]|\\.)+)\]:[ \t]*\n?[ \t]*(<[^<>\n]*>|\S+)/dgm;
	for (const match of text.matchAll(definition)) {
		if (!imageLabels.has(normalizeLabel(match[1]))) continue;
		const [start, end] = match.indices[2];
		const url = match[2].startsWith('<') ? { start: start + 1, end: end - 1 } : { start, end };
		spans.push({ kind: 'reference', ...url });
	}

	const imgTag = /<img\b[^>]*?\ssrc\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/dgi;
	for (const match of text.matchAll(imgTag)) {
		const [start, end] = match.indices[1] ?? match.indices[2] ?? match.indices[3];
		spans.push({ kind: 'tag', start, end });
	}

	return spans.map((span) => ({ ...span, raw: body.slice(span.start, span.end) }));
}

/** Parses "url "title")" after "](" and returns the URL offsets and the offset after ")". */
function parseInlineDestination(text, from) {
	let i = skipSpace(text, from);
	let start = i;
	let end = i;
	if (text[i] === '<') {
		const close = text.indexOf('>', i);
		if (close === -1 || /[\n<]/.test(text.slice(i + 1, close))) return null;
		start = i + 1;
		end = close;
		i = close + 1;
	} else {
		let depth = 0;
		for (; i < text.length; i++) {
			const char = text[i];
			if (char === '\\') {
				i++;
				continue;
			}
			if (/[\s\x00-\x1f]/.test(char)) break;
			if (char === '(') depth++;
			else if (char === ')') {
				if (depth === 0) break;
				depth--;
			}
		}
		if (depth > 0) return null;
		end = i;
	}

	const afterUrl = i;
	i = skipSize(text, skipSpace(text, i), afterUrl);
	if (i > afterUrl && `"'(`.includes(text[i])) {
		const titleEnd = skipTitle(text, i);
		if (titleEnd === -1) return null;
		i = skipSize(text, skipSpace(text, titleEnd), titleEnd);
	}
	if (text[i] !== ')') return null;
	return { start, end, close: i + 1 };
}

/** Skips spaces and tabs, and at most one line break. */
function skipSpace(text, i) {
	let newline = false;
	for (; i < text.length; i++) {
		if (text[i] === '\n' && !newline) newline = true;
		else if (text[i] !== ' ' && text[i] !== '\t') break;
	}
	return i;
}

/** Skips the HedgeDoc image size ( =WxH, =Wx, =xH ) if there is whitespace before it. */
function skipSize(text, i, after) {
	if (i === after) return i;
	const size = /=\d*x\d*(?=[\s)])/y;
	size.lastIndex = i;
	return size.test(text) ? skipSpace(text, size.lastIndex) : i;
}

function skipTitle(text, i) {
	const open = text[i];
	const close = open === '(' ? ')' : open;
	for (let j = i + 1; j < text.length; j++) {
		const char = text[j];
		if (char === '\\') j++;
		else if (char === close) return j + 1;
		else if (open === '(' && char === '(') return -1;
		else if (char === '\n' && isBlankLineAfter(text, j)) return -1;
	}
	return -1;
}

/** Returns the index of the "]" that closes the "[" at `open`, or -1. */
function closingBracket(text, open) {
	let depth = 0;
	for (let i = open; i < text.length; i++) {
		const char = text[i];
		if (char === '\\') i++;
		else if (char === '[') depth++;
		else if (char === ']' && --depth === 0) return i;
		else if (char === '\n' && isBlankLineAfter(text, i)) return -1;
	}
	return -1;
}

function isBlankLineAfter(text, newline) {
	return /^\n[ \t]*(?:\n|$)/.test(text.slice(newline, newline + 200));
}

function isEscaped(text, i) {
	let backslashes = 0;
	while (text[i - 1 - backslashes] === '\\') backslashes++;
	return backslashes % 2 === 1;
}

function normalizeLabel(label) {
	return label.trim().replace(/\s+/g, ' ').toLowerCase();
}

/** Blanks out fenced code blocks, code spans and HTML comments, keeping every offset. */
function maskCode(text) {
	const blank = (part) => part.replace(/[^\n]/g, ' ');
	let masked = '';
	let fence = null;
	for (const line of text.split(/(?<=\n)/)) {
		const marker = line.match(/^ {0,3}(`{3,}|~{3,})/)?.[1];
		if (fence) {
			masked += blank(line);
			const closes = marker && marker[0] === fence[0] && marker.length >= fence.length;
			if (closes && !line.trim().slice(marker.length).trim()) fence = null;
		} else if (marker && !(marker[0] === '`' && line.trim().slice(marker.length).includes('`'))) {
			fence = marker;
			masked += blank(line);
		} else {
			masked += line;
		}
	}
	return masked
		.replace(/<!--[\s\S]*?-->/g, blank)
		.replace(/(?<!`)(`+)(?!`)((?:(?!\n[ \t]*\n)[\s\S])+?)(?<!`)\1(?!`)/g, blank);
}

/** Links to other HedgeDoc notes (not uploads). They are reported, not rewritten. */
function findNoteLinks(body) {
	const host = HEDGEDOC_HOST.replaceAll('.', '\\.');
	const links = body.matchAll(new RegExp(`https?://${host}/[^\\s)<>"'\\]]*`, 'g'));
	const notes = [...links]
		.map(([url]) => url.replace(/[.,;:!?]+$/, ''))
		.filter((url) => {
			const { pathname } = new URL(url);
			return pathname !== '/' && !pathname.startsWith('/uploads/');
		});
	return [...new Set(notes)];
}

// ---------------------------------------------------------------------------
// Files

/**
 * Maps every page folder (relative to src/content) to its source: (null for hand-written pages)
 * and its position: (used by Home image fillers).
 */
async function indexPages() {
	const byDir = new Map();
	const bySource = new Map();
	const files = await readdir(CONTENT_DIR, { recursive: true }).catch((error) => {
		if (error.code === 'ENOENT') return [];
		throw error;
	});
	for (const file of files) {
		if (path.basename(file) !== 'index.md' || path.dirname(file) === '.') continue;
		const dir = path.dirname(file).split(path.sep).join('/');
		const page = await readPage(path.join(CONTENT_DIR, file));
		byDir.set(dir, page);
		if (page.source) bySource.set(page.source, dir);
	}
	return { byDir, bySource };
}

async function readPage(file) {
	try {
		const match = (await readFile(file, 'utf8')).match(FRONT_MATTER);
		if (!match) return { source: null };
		const doc = parseDocument(match[1] ?? '');
		const position = doc.get('position');
		const source = doc.get('source');
		if (typeof source !== 'string' || !source.trim()) return { source: null, position };
		const ref = parseNoteUrl(source.trim());
		return { source: ref?.id ? canonicalSource(ref.id) : source.trim(), position };
	} catch {
		return { source: null };
	}
}

async function writePage(dir, markdown, images, { replace }) {
	const folder = path.join(CONTENT_DIR, dir);
	const assets = path.join(folder, 'assets');
	await mkdir(folder, { recursive: true });
	if (replace) await rm(assets, { recursive: true, force: true });
	if (images.length) await mkdir(assets, { recursive: true });
	for (const { file, data } of images) await writeFile(path.join(assets, file), data);
	await writeFile(path.join(folder, 'index.md'), markdown);
}

/** Removes a page's index.md and assets/, and its folder only if nothing else is left in it. */
async function removePage(dir) {
	const folder = path.join(CONTENT_DIR, dir);
	await rm(path.join(folder, 'index.md'), { force: true });
	await rm(path.join(folder, 'assets'), { recursive: true, force: true });
	try {
		await rmdir(folder);
	} catch (error) {
		if (error.code !== 'ENOTEMPTY' && error.code !== 'EEXIST') throw error;
		report.warnings.push(`src/content/${dir}/ was kept because it contains other files.`);
	}
}

async function hasEntries(folder) {
	try {
		return (await readdir(folder)).length > 0;
	} catch {
		return false;
	}
}

function pagePath(dir, file = 'index.md') {
	return `src/content/${dir}/${file}`;
}

function relative(file) {
	return path.relative(process.cwd(), file);
}

// ---------------------------------------------------------------------------
// Summary

function printSummary(dryRun) {
	const would = dryRun ? 'would be ' : '';
	const section = (title, items, format) => {
		console.log(`\n${title} (${items.length})`);
		for (const item of items) console.log(`  ${format(item)}`);
	};

	console.log(`\n${'─'.repeat(60)}\nSummary${dryRun ? ' (dry run)' : ''}`);
	section(`Pages ${would}added`, report.added, (p) => `${pagePath(p.dir)}  ← ${p.source}`);
	if (report.reimported.length) {
		section(`Pages ${would}re-imported`, report.reimported, (p) =>
			`${pagePath(p.dir)}${p.movedFrom ? `  (moved from ${pagePath(p.movedFrom)})` : ''}  ← ${p.source}`
		);
	}
	section('Skipped, already present', report.skipped, (p) => `${pagePath(p.dir)}  ← ${p.source}`);
	section('Conflicts, not imported', report.conflicts, (p) => `${pagePath(p.dir)}  ← ${p.source}: ${p.reason}`);
	section('Errors', report.errors, (message) => message);
	if (report.warnings.length) section('Warnings', report.warnings, (message) => message);
	section(`Images ${dryRun ? 'to download' : 'downloaded'}`, report.images, (image) =>
		`${image.file}${image.size ? ` (${Math.round(image.size / 1024)} KB)` : ''}  ← ${image.url}`
	);
	section('Images not downloaded, original link kept', report.failedImages, (image) =>
		`${pagePath(image.dir)}: ${image.url} (${image.reason})`
	);
	section('Links to other HedgeDoc notes, not rewritten', report.noteLinks, (link) => `${pagePath(link.dir)}: ${link.url}`);
	if (report.unlisted.length) {
		section(`Pages no longer in ${relative(URL_LIST)}, kept`, report.unlisted, (p) =>
			`${pagePath(p.dir)}  ← ${p.source}`
		);
	}
}
