// Imports the HedgeDoc notes listed in src/content/contents.yaml into
// src/content/<section>/<slug>/index.md, with their images in assets/, and writes the list again,
// filed by section: each page with its title, the link of its note and the day it was fetched.
// Notes with `type: home-image-filler` are Home image fillers: they are validated and written
// to src/content/home-image-fillers/<slug>/index.md.
// The rules are documented in CLAUDE.md, under "Content".
//
//   npm run syncFromHedgeDoc                        import the notes that are missing
//   npm run syncFromHedgeDoc -- --dry-run           show what would happen, write nothing
//   npm run syncFromHedgeDoc -- --force <path>      re-import one page, e.g. events/<slug>
//   npm run syncFromHedgeDoc -- --refresh           re-import every page of the list
//   npm run syncFromHedgeDoc -- --prune             also delete the pages taken off the list
//   npm run syncFromHedgeDoc -- --rebuild-list      write the list again from the pages, offline

import { mkdir, readFile, readdir, rm, rmdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { isMap, isScalar, isSeq, parseDocument, stringify } from 'yaml';

const HEDGEDOC = 'https://pad.dsl.unibe.ch';
const HEDGEDOC_HOST = new URL(HEDGEDOC).hostname;
const CONTENT_DIR = fileURLToPath(new URL('../src/content/', import.meta.url));
const CONTENTS = path.join(CONTENT_DIR, 'contents.yaml');

const SECTIONS = {
	event: 'events',
	publication: 'publications',
	artifact: 'artifacts',
	about: 'about',
	// The team page is a page of About: a note titled "Team" is src/content/about/team.
	team: 'about',
	'home-image-filler': 'home-image-fillers'
};
const FALLBACK_TYPE = 'about';
const FILLER_SECTION = SECTIONS['home-image-filler'];
// The sections of contents.yaml, in the order of the website, with the comment above each.
const LIST_SECTIONS = [
	['about', 'The pages of About: /about/<page>'],
	['events', 'The events: /events/<page>'],
	['publications', 'The publications: /publications/<page>'],
	['artifacts', 'The artifacts: /artifacts/<page>'],
	[FILLER_SECTION, 'The images of the Home grid: they have no page of their own']
];
// The key of contents.yaml that holds the links still to import.
const NEW = 'new';

// The settings (front matter fields) of a note: the ones of docs/templates/page.md and
// docs/templates/home-image-filler.md, plus the two that the import adds.
const ADDED_FIELDS = ['source', 'importedAt'];
const PAGE_FIELDS = [
	'type', 'title', 'subtitle', 'keywords', 'date', 'venue', 'location', 'authors', 'publication-type', 'doi',
	'download-link', 'kind', 'members', 'advisory-board', 'excerpt', 'position', 'hidden-from-home', 'slug', 'tags'
];
const FILLER_FIELDS = ['type', 'title', 'accent', 'position', 'slug', 'tags'];
const PEOPLE_FIELDS = {
	members: ['name', 'role', 'affiliation', 'photo', 'external-url'],
	'advisory-board': ['name', 'affiliation', 'external-url']
};
// Old names, with what to write instead.
const RENAMED_FIELDS = { externalURL: 'external-url', advisory_board: 'advisory-board' };
const REMOVED_FIELDS = { pinned: 'it is no longer used: set "position" to place the page in the Home grid' };
const ADDED_COMMENT = ' ── ADDED BY THE IMPORT: DO NOT EDIT ──────────────────────────────────';
const FILLER_ACCENTS = ['about', 'event', 'publication', 'artifact'];
const SLUG_MAX_LENGTH = 60;
const NOTE_TIMEOUT_MS = 15_000;
const IMAGE_TIMEOUT_MS = 60_000;

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
// Front matter fields that hold an image URL, at any depth (e.g. `photo` in the team's `members`).
const IMAGE_FIELDS = new Set(['photo']);
// Image placeholder services (and their subdomains): their images are not downloaded and their URLs stay.
const PLACEHOLDER_HOSTS = [
	'picsum.photos',
	'placehold.co',
	'placeholder.com',
	'dummyimage.com',
	'loremflickr.com',
	'placekitten.com',
	'fakeimg.pl'
];
const SPECIAL_LETTERS = { ß: 'ss', æ: 'ae', œ: 'oe', ø: 'o', ł: 'l', đ: 'd', þ: 'th' };
// Top-level HedgeDoc paths that are not notes.
const RESERVED_PATHS = new Set(['s', 'p', 'new', 'uploads', 'login', 'logout', 'me', 'history', 'status', 'config']);

const FRONT_MATTER = /^---[ \t]*\r?\n(?:([\s\S]*?)\r?\n)?---[ \t]*(?:\r?\n|$)/;

const USAGE = `Usage:
  npm run syncFromHedgeDoc                     import the notes listed in src/content/contents.yaml
  npm run syncFromHedgeDoc -- --dry-run        show what would happen without writing anything
  npm run syncFromHedgeDoc -- --force <path>   re-import a page; <path> is relative to src/content, e.g. events/<slug>
  npm run syncFromHedgeDoc -- --refresh        re-import every page of the list
  npm run syncFromHedgeDoc -- --prune          also delete the imported pages that are no longer in the list
  npm run syncFromHedgeDoc -- --rebuild-list   write the list again from the pages of the repository (no network)`;

// The comment at the top of contents.yaml, written again at every run.
const LIST_HEADER = `# ══════════════════════════════════════════════════════════════════════
#  CONTENTS OF THE WEBSITE
#
#  The pages of the website are written as notes on HedgeDoc
#  (${HEDGEDOC}). This file lists the notes to fetch: the
#  command below copies them into this repository, and the website is
#  built from the copies.
#
#      npm run syncFromHedgeDoc
#
#  TO ADD A PAGE
#  1. Create a note on HedgeDoc, then press "Publish".
#  2. Copy the link of the page that opens. It looks like this:
#     ${HEDGEDOC}/s/AbCdEfGhI
#  3. Paste it in the "new" list below, on a line of its own, after "- ".
#     Here is an example with two links:
#
#       new:
#         - ${HEDGEDOC}/s/AbCdEfGhI
#         - ${HEDGEDOC}/s/JkLmNoPqR
#
#  4. Run the command above.
#
#  The command files every new page under its section, with its title,
#  the link of its note and the day it was fetched, and it empties the
#  "new" list. The sections follow the structure of the website.
#
#  This file is written again at every run. Only the links matter: the
#  titles and the dates are read from the pages, and comments you add
#  here are not kept. To update or remove a page, see docs/CONTENT.md.
# ══════════════════════════════════════════════════════════════════════`;

class NetworkError extends Error {
	constructor(reason, url) {
		super(`${reason} (${url})`);
		this.reason = reason;
		this.url = url;
	}
}

class HostUnreachableError extends Error {}

class ListError extends Error {}

const report = {
	added: [],
	reimported: [],
	skipped: [],
	conflicts: [],
	errors: [],
	warnings: [],
	images: [],
	failedImages: [],
	placeholders: [],
	noteLinks: [],
	unlisted: [],
	pruned: [],
	list: null
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
	let pages = await indexPages();

	if (options.rebuildList) {
		// Offline: every imported page goes in the list; the links still to import are kept.
		const links = await readList().catch(() => []);
		resolveOffline(links);
		await writeList(pages, links, { ...options, all: true });
		printSummary(options.dryRun);
		return report.errors.length ? 1 : 0;
	}

	let links;
	try {
		links = await readList();
	} catch (error) {
		if (!(error instanceof ListError)) throw error;
		console.error(error.message);
		return 1;
	}

	const jobs = options.force.length ? forceJobs(options.force, pages) : listJobs(links);
	const importedAt = new Date().toISOString().replace(/\.\d+Z$/, 'Z');
	// The pages that this run re-imports and has not reached yet: their settings are about to change.
	const stale = new Set(
		jobs.map((job) => job.force ?? (options.refresh && job.ref.id && pages.bySource.get(canonicalSource(job.ref.id)))).filter(Boolean)
	);

	for (const [index, job] of jobs.entries()) {
		console.log(`[${index + 1}/${jobs.length}] ${job.label}`);
		try {
			await processJob(job, pages, { ...options, importedAt, stale });
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

	resolveOffline(links);
	if (!options.dryRun) pages = await indexPages();
	if (!options.force.length) {
		findUnlistedPages(pages, links);
		if (options.prune) await prune(pages, links, options);
	}
	await writeList(pages, links, options);

	printSummary(options.dryRun);
	return report.errors.length || report.conflicts.length || report.failedImages.length ? 1 : 0;
}

function parseArgs(args) {
	// `npm run syncFromHedgeDoc --dry-run` (without `--`) hands the flag to npm, which only sets
	// npm_config_dry_run; the same goes for --force, whose path still reaches the script.
	const npmForce = process.env.npm_config_force === 'true';
	const options = {
		dryRun: process.env.npm_config_dry_run === 'true',
		force: [],
		refresh: false,
		prune: false,
		rebuildList: false,
		help: false
	};
	for (let i = 0; i < args.length; i++) {
		const arg = args[i];
		if (arg === '--dry-run') options.dryRun = true;
		else if (arg === '--refresh') options.refresh = true;
		else if (arg === '--prune') options.prune = true;
		else if (arg === '--rebuild-list') options.rebuildList = true;
		else if (arg === '--help' || arg === '-h') options.help = true;
		else if (arg === '--force') {
			if (!args[i + 1] || args[i + 1].startsWith('--')) throw new Error('--force needs a path.');
			options.force.push(args[++i]);
		} else if (arg.startsWith('--force=')) options.force.push(arg.slice('--force='.length));
		else if (npmForce && !arg.startsWith('-')) options.force.push(arg);
		else throw new Error(`Unknown argument: ${arg}`);
	}
	if (npmForce && !options.force.length) throw new Error('--force needs a path.');
	if (options.force.length && (options.refresh || options.prune || options.rebuildList)) {
		throw new Error('--force cannot be used with --refresh, --prune or --rebuild-list.');
	}
	if (options.rebuildList && (options.refresh || options.prune)) {
		throw new Error('--rebuild-list cannot be used with --refresh or --prune.');
	}
	return options;
}

// ---------------------------------------------------------------------------
// The list: src/content/contents.yaml

/**
 * The links of the list, in the order of the file: the plain links (under "new", or dropped
 * anywhere else) and the `url` of the entries filed under the sections. Each link has `ref`, null
 * when it is not the URL of a note, and `source`, the canonical URL of its note once it is known.
 */
async function readList() {
	let text;
	try {
		text = await readFile(CONTENTS, 'utf8');
	} catch (error) {
		if (error.code !== 'ENOENT') throw error;
		throw new ListError(
			`${relative(CONTENTS)} does not exist. Run the script with --rebuild-list to write it from the pages of the repository.`
		);
	}
	const doc = parseDocument(text);
	const data = doc.errors.length ? null : (doc.toJS() ?? {});
	if (!isRecord(data)) {
		const [error] = doc.errors;
		const where = error?.linePos?.[0]?.line ? `, line ${error.linePos[0].line}` : '';
		const what = error ? error.message.split('\n')[0] : 'it must hold the "new" list and the sections';
		throw new ListError(
			`${relative(CONTENTS)} cannot be read${where}: ${what}\n` +
				'Fix that line (often a missing "- " before a link, or a wrong indentation), or run the script ' +
				'with --rebuild-list to write the file again from the pages of the repository.'
		);
	}

	const links = [];
	const seen = new Set();
	for (const [section, value] of Object.entries(data)) {
		for (const entry of value == null ? [] : [value].flat()) {
			const url = typeof entry === 'string' ? entry.trim() : isRecord(entry) && typeof entry.url === 'string' ? entry.url.trim() : '';
			if (!url) {
				if (entry != null) report.warnings.push(`${relative(CONTENTS)}: an entry of "${section}" has no link, so it was left out.`);
				continue;
			}
			if (seen.has(url)) continue;
			seen.add(url);
			const ref = parseNoteUrl(url);
			if (!ref) report.errors.push(`${relative(CONTENTS)}: not the link of a note on ${HEDGEDOC}: ${url}`);
			links.push({ url, ref, source: null });
		}
	}
	return links;
}

/** The notes whose address holds their id are known without asking the server. */
function resolveOffline(links) {
	for (const link of links) link.source ??= link.ref?.id ? canonicalSource(link.ref.id) : null;
}

/**
 * Writes the list again: the links that have no page yet under "new", and every listed page under
 * its section, with its title, the URL of its note and the day it was fetched. `all` lists every
 * imported page, also those that the list does not have (--rebuild-list).
 */
async function writeList(pages, links, { dryRun, all = false }) {
	const listed = new Set(links.map((link) => link.source).filter(Boolean));
	const sections = new Map(LIST_SECTIONS.map(([name]) => [name, []]));
	for (const [dir, page] of pages.byDir) {
		if (!page.source || !(all || listed.has(page.source))) continue;
		const name = [...sections.keys()].find((section) => dir.startsWith(`${section}/`));
		if (!name) continue;
		const slug = dir.slice(name.length + 1);
		sections.get(name).push({ ...page, slug, title: page.title ?? slug });
	}
	const byDate = (a, b) => (b.date ?? '').localeCompare(a.date ?? '') || a.slug.localeCompare(b.slug);
	const byPosition = (a, b) => (Number(a.position) || 0) - (Number(b.position) || 0) || a.slug.localeCompare(b.slug);
	const pending = links.filter((link) => !(link.source && pages.bySource.has(link.source))).map((link) => link.url);

	const scalar = (value) => stringify(String(value), { lineWidth: 0 }).trimEnd();
	const lines = [LIST_HEADER, '', `${NEW}:`, ...pending.map((url) => `  - ${url}`)];
	let count = 0;
	for (const [name, comment] of LIST_SECTIONS) {
		lines.push('', `# ${comment}`, `${name}:`);
		for (const entry of sections.get(name).sort(name === FILLER_SECTION ? byPosition : byDate)) {
			if (count++ && lines.at(-1) !== `${name}:`) lines.push('');
			lines.push(`  - page: ${scalar(entry.slug)}`, `    title: ${scalar(entry.title)}`, `    url: ${entry.source}`);
			if (entry.importedAt) lines.push(`    synced: ${entry.importedAt.slice(0, 10)}`);
		}
	}
	const text = `${lines.join('\n')}\n`;
	const current = await readFile(CONTENTS, 'utf8').catch(() => null);
	report.list = { changed: text !== current, pages: count, pending: pending.length };
	if (!dryRun && text !== current) await writeFile(CONTENTS, text);
}

// ---------------------------------------------------------------------------
// Jobs

/** One job per link of the list that is a note URL. The job fills in the `source` of its link. */
function listJobs(links) {
	return links.filter((link) => link.ref).map((link) => ({ label: link.url, ref: link.ref, link }));
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

/** Reports imported pages whose link is no longer in the list. They are kept, unless --prune is given. */
function findUnlistedPages(pages, links) {
	const imported = [...pages.byDir].filter(([, page]) => page.source);
	if (!imported.length) return;
	if (links.some((link) => !link.source)) {
		report.warnings.push('Could not check for pages removed from the list: some links were not resolved.');
		return;
	}
	const listed = new Set(links.map((link) => link.source));
	for (const [dir, page] of imported) {
		if (!listed.has(page.source)) report.unlisted.push({ dir, source: page.source });
	}
}

/** --prune: deletes the imported pages that are no longer in the list. Hand-written pages are never touched. */
async function prune(pages, links, { dryRun }) {
	if (!report.unlisted.length) return;
	// An empty or unresolved list must never empty the website.
	if (!links.some((link) => link.source && pages.bySource.has(link.source))) {
		report.warnings.push('--prune: the list holds no imported page, so nothing was deleted.');
		return;
	}
	for (const page of report.unlisted) {
		if (!dryRun) await removePage(page.dir);
		pages.byDir.delete(page.dir);
		pages.bySource.delete(page.source);
		report.pruned.push(page);
		console.log(`      ${dryRun ? 'would delete' : 'deleted'} ${pagePath(page.dir)}: no longer in the list`);
	}
	report.unlisted = [];
}

/** Normalizes a --force argument to a page folder relative to src/content, e.g. "events/<slug>". */
function pageDir(given) {
	let dir = path.posix.normalize(given.replaceAll('\\', '/'));
	dir = dir.replace(/^\.\//, '').replace(/^src\/content\//, '').replace(/(\/index\.md|\/)$/, '');
	if (!dir || dir === '.' || dir.startsWith('..') || path.posix.isAbsolute(dir)) return null;
	return dir;
}

async function processJob(job, pages, { dryRun, importedAt, refresh, stale }) {
	const id = job.ref.id ?? (await resolveShortId(job.ref.shortid));
	const source = canonicalSource(id);
	if (job.link) job.link.source = source;

	const present = pages.bySource.get(source);
	// --refresh re-imports the pages that are already there, as --force does for one page.
	if (present && refresh) job.force = present;
	if (present) stale.delete(present);
	if (present && !job.force) {
		report.skipped.push({ dir: present, source });
		console.log(`      already present: ${pagePath(present)}`);
		return;
	}

	const note = parseNote(await fetchNote(id));
	const { section, warning } = sectionFor(note.doc.get('type'));
	if (warning) report.warnings.push(`${source}: ${warning}`);
	const filler = section === FILLER_SECTION;
	const dir = `${section}/${slugFor(note, filler)}`;
	if (filler) validateFiller(note, dir, pages, stale);
	for (const problem of checkSettings(note.doc, filler)) report.warnings.push(`${pagePath(dir)}: ${problem}`);

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

	const body = note.body.endsWith('\n') ? note.body : `${note.body}\n`;
	const markdown = `---\n${renderSettings(note, source, importedAt)}---\n${body}`;

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

/**
 * A note as its settings (the front matter: `front` is its text, `doc` what it says) and its body.
 * `edits` collects the changes to make to the text of the settings: the image links to localise.
 */
function parseNote(markdown) {
	const match = markdown.match(FRONT_MATTER);
	const front = match?.[1] ?? '';
	const doc = parseDocument(front);
	if (doc.errors.length) {
		const [error] = doc.errors;
		const line = error.linePos?.[0]?.line;
		throw new Error(
			`the settings of the note cannot be read${line ? ` (line ${line + 1} of the note)` : ''}: ${error.message.split('\n')[0]} ` +
				'A text with a colon (:), such as a title, must be in "quotes".'
		);
	}
	if (doc.contents !== null && !isMap(doc.contents)) throw new Error('the settings of the note are not a list of "name: value" lines.');
	return { doc, front, edits: [], body: match ? markdown.slice(match[0].length) : markdown };
}

/**
 * The settings of a note as they are written in the repository: the text of the note as it is,
 * with its image links localised, followed by `source:` and `importedAt:` under a comment that
 * says who wrote them. The text is never written again from the parsed values, so the comments,
 * the empty fields and the layout of the note stay exactly as on HedgeDoc.
 */
function renderSettings(note, source, importedAt) {
	let text = note.front;
	for (const { start, end, value } of [...note.edits].sort((a, b) => b.start - a.start)) {
		text = text.slice(0, start) + value + text.slice(end);
	}
	// The lines of an earlier import, when the settings were copied back from the repository.
	const lines = text.split(/\r?\n/).filter((line) => !/^(source|importedAt):/.test(line) && line !== `#${ADDED_COMMENT}`);
	text = lines.join('\n').replace(/\s+$/, '');
	return `${text}${text ? '\n\n' : ''}#${ADDED_COMMENT}\nsource: ${source}\nimportedAt: ${importedAt}\n`;
}

function sectionFor(type) {
	const key = type == null ? '' : String(type).toLowerCase().replace(/\s+/g, '');
	if (Object.hasOwn(SECTIONS, key)) return { section: SECTIONS[key] };
	const problem = key ? `unknown type "${type}"` : 'no type';
	return { section: SECTIONS[FALLBACK_TYPE], warning: `${problem}, filed under "${FALLBACK_TYPE}".` };
}

/**
 * The folder of a note inside its section: its `slug:`, or else its title. A page must have a
 * title. A Home image without one is named after its image file or, when that name says nothing
 * (the id of an upload), after the first words of its description: a folder is never named after an id.
 */
function slugFor(note, filler) {
	for (const field of ['slug', 'title']) {
		const value = note.doc.get(field);
		const slug = value == null ? '' : slugify(String(value));
		if (slug) return slug;
	}
	if (!filler) throw new Error('the note has no title: add "title:" to its settings, on HedgeDoc.');
	const [image] = findImageUrls(note.body);
	const fileName = image ? path.posix.basename(image.raw.split(/[?#]/)[0]).replace(/\.[a-z0-9]+$/i, '') : '';
	const firstWords = (image?.alt ?? '').trim().split(/\s+/).slice(0, 4).join(' ');
	for (const candidate of [fileName, firstWords]) {
		const slug = slugify(candidate);
		if (slug && !isIdLike(slug)) return slug;
	}
	const position = note.doc.get('position');
	return Number.isInteger(position) ? `image-${position}` : 'image';
}

/** Whether a name reads as a generated id (a UUID, or a long run of mixed letters and digits) and not as words. */
function isIdLike(slug) {
	if (/^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/.test(slug)) return true;
	return slug.split('-').some((part) => part.length >= 16 && /\d/.test(part) && /[a-z]/.test(part));
}

/**
 * What is wrong with the settings of a note, in plain words, for the summary: names that the
 * website does not know (often a typing mistake, or an old name), and values it cannot read.
 * The note is imported all the same.
 */
function checkSettings(doc, filler) {
	const problems = [];
	const data = doc.toJS() ?? {};
	const known = filler ? FILLER_FIELDS : PAGE_FIELDS;
	for (const key of Object.keys(data)) {
		if (known.includes(key) || ADDED_FIELDS.includes(key)) continue;
		problems.push(`"${key}" is not a setting of the website${hintFor(key, known)}`);
	}
	if (filler) return problems;

	const filled = (value) => value != null && value !== '';
	const { date, position } = data;
	if (filled(date) && !/^\d{4}(-\d{2}-\d{2})?$/.test(String(date).trim())) {
		problems.push(`the date ${describe(date)} is not written as YEAR-MONTH-DAY (2026-05-08) or as a year (2026)`);
	}
	if (filled(position) && (!Number.isInteger(position) || position === 0)) {
		problems.push(`"position" must be a whole number other than 0, such as 2 or -1 (found ${describe(position)}): the website cannot be built until it is fixed`);
	}
	const hidden = data['hidden-from-home'];
	if (filled(hidden) && !['true', 'false'].includes(String(hidden).trim().toLowerCase())) {
		problems.push(`"hidden-from-home" must be true, or be left empty (found ${describe(hidden)})`);
	}
	for (const [field, fields] of Object.entries(PEOPLE_FIELDS)) {
		const people = data[field];
		if (people == null) continue;
		if (!Array.isArray(people)) {
			problems.push(`"${field}" must be a list of people, each starting with "- name:"`);
			continue;
		}
		const names = new Set(people.flatMap((person) => (isRecord(person) ? Object.keys(person) : [])));
		for (const key of names) {
			if (!fields.includes(key)) problems.push(`"${key}" is not a setting of a person in "${field}"${hintFor(key, fields)}`);
		}
	}
	return problems;
}

/** What to write instead of a name that the website does not know. */
function hintFor(key, known) {
	if (RENAMED_FIELDS[key]) return `: it is now called "${RENAMED_FIELDS[key]}"`;
	if (REMOVED_FIELDS[key]) return `: ${REMOVED_FIELDS[key]}`;
	const plain = (name) => name.toLowerCase().replace(/[-_\s]/g, '');
	const near = known.find((name) => plain(name) === plain(key)) ?? known.find((name) => editDistance(name, key.toLowerCase()) <= 2);
	return near ? `: did you mean "${near}"?` : ', so it is ignored';
}

/** The number of single-letter changes between two words. */
function editDistance(a, b) {
	let row = Array.from({ length: b.length + 1 }, (_, i) => i);
	for (let i = 1; i <= a.length; i++) {
		const next = [i];
		for (let j = 1; j <= b.length; j++) {
			next[j] = Math.min(row[j] + 1, next[j - 1] + 1, row[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
		}
		row = next;
	}
	return row[b.length];
}

function isRecord(value) {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
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
 * what to fix in the note. Its position must not be taken by another filler; the fillers in
 * `stale`, which the same run re-imports later, do not count, since their position may change.
 */
function validateFiller(note, dir, pages, stale) {
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
			if (other !== dir && !stale.has(other) && other.startsWith(`${FILLER_SECTION}/`) && page.position === position) {
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
 * Downloads the images of a note, from its body and from the image fields of its front matter,
 * and points their links to ./assets/<file>. Images from placeholder services keep their URL.
 * Rewrites note.body in place, records the changes to the settings in note.edits and returns the files to write. In a dry run,
 * downloads nothing.
 */
async function localizeImages(note, dir, dryRun) {
	const spans = findImageUrls(note.body);
	const fields = findImageFields(note.doc.contents);
	const undescribed = spans.filter((span) => span.kind === 'inline' && !span.alt.trim()).length;
	if (undescribed) {
		report.warnings.push(
			`${pagePath(dir)}: ${undescribed} image(s) without a description. Write it between the square brackets, ` +
				'![description](link): it is read aloud to people who cannot see the image.'
		);
	}
	const byUrl = new Map(); // resolved URL -> file name, or null if it failed or is a placeholder
	const usedNames = new Set();
	const files = [];
	const target = `${pagePath(dir, 'assets')}/`;

	for (const raw of [...spans.map((span) => span.raw), ...fields.map((field) => field.value)]) {
		const url = resolveImageUrl(raw);
		if (!url || byUrl.has(url)) continue;
		if (isPlaceholder(url)) {
			byUrl.set(url, null);
			report.placeholders.push({ dir, url });
			continue;
		}
		if (!isUpload(url)) {
			report.warnings.push(
				`${pagePath(dir)}: the image ${url} is not on HedgeDoc. It is copied all the same, but upload it to the note ` +
					'("Upload Image") and use that link, so that the page does not depend on another website.'
			);
		}
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
	// The fields are changed in the text of the settings, at the place of their value.
	for (const field of fields) {
		const file = byUrl.get(resolveImageUrl(field.value));
		if (file && field.range) note.edits.push({ start: field.range[0], end: field.range[1], value: `./assets/${file}` });
	}
	return files;
}

/** The scalars of the front matter under an image field (IMAGE_FIELDS), at any depth, that hold text. */
function findImageFields(node) {
	if (isSeq(node)) return node.items.flatMap(findImageFields);
	if (!isMap(node)) return [];
	return node.items.flatMap(({ key, value }) => {
		const isImage = IMAGE_FIELDS.has(isScalar(key) ? String(key.value) : String(key));
		if (isImage && isScalar(value) && typeof value.value === 'string' && value.value.trim()) return [value];
		return findImageFields(value);
	});
}

/** Whether an image was uploaded to HedgeDoc, as the notes should do with every image. */
function isUpload(url) {
	const { hostname, pathname } = new URL(url);
	return hostname === HEDGEDOC_HOST && pathname.startsWith('/uploads/');
}

function isPlaceholder(url) {
	const { hostname } = new URL(url);
	return PLACEHOLDER_HOSTS.some((host) => hostname === host || hostname.endsWith(`.${host}`));
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
 * Maps every page folder (relative to src/content) to what its settings say: its source: (null for
 * hand-written pages), its position: (used by Home image fillers) and, for the list, its title,
 * date and importedAt.
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
		const text = (field) => (doc.get(field) == null ? undefined : String(doc.get(field)).trim() || undefined);
		const page = {
			position: doc.get('position'),
			title: text('title') && stripMarkdown(text('title')),
			date: text('date'),
			importedAt: text('importedAt')
		};
		const source = doc.get('source');
		if (typeof source !== 'string' || !source.trim()) return { ...page, source: null };
		const ref = parseNoteUrl(source.trim());
		return { ...page, source: ref?.id ? canonicalSource(ref.id) : source.trim() };
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
	if (report.placeholders.length) {
		section('Placeholder images, not downloaded, link kept', report.placeholders, (image) =>
			`${pagePath(image.dir)}: ${image.url}`
		);
	}
	section('Links to other HedgeDoc notes, not rewritten', report.noteLinks, (link) => `${pagePath(link.dir)}: ${link.url}`);
	if (report.unlisted.length) {
		section(`Pages no longer in ${relative(CONTENTS)}, kept (run with --prune to delete them)`, report.unlisted, (p) =>
			`${pagePath(p.dir)}  ← ${p.source}`
		);
	}
	if (report.pruned.length) {
		section(`Pages no longer in ${relative(CONTENTS)}, ${would}deleted`, report.pruned, (p) => `${pagePath(p.dir)}  ← ${p.source}`);
	}
	if (report.list) {
		const { changed, pages, pending } = report.list;
		const state = !changed ? 'is up to date' : dryRun ? 'would be written again' : 'was written again';
		console.log(`\n${relative(CONTENTS)} ${state}: ${pages} page(s) filed, ${pending} link(s) under "${NEW}".`);
	}
}
