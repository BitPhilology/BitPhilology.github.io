// Renders the markdown body of a post at build time (server only, with unified: remark, then
// rehype). It returns the lead paragraph and the body as segments of HTML and embeds. Embed markers
// ({{team}}) are handled on the markdown tree, before any HTML exists: a marker paragraph becomes a
// placeholder element, and the HTML is cut there.
import type { Element, Root as HastRoot, RootContent } from 'hast';
import { toHtml } from 'hast-util-to-html';
import type { Root as MdastRoot, Nodes, Paragraph } from 'mdast';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import { findMarkers, markerName } from '$lib/content/markers';
import type { BodySegment, RenderedBody } from '$lib/content/types';
import { EMBEDS, isEmbedName, type EmbedName } from '$lib/embeds';
import { MARKDOWN_CLASSES } from '$lib/styles/markdown';

// Raw HTML in the markdown is dropped (remark-rehype's default), so the output is safe for {@html}.
// rehype-slug gives the headings ids, so that links can point to a section.
const processor = unified().use(remarkParse).use(remarkGfm).use(remarkRehype).use(rehypeSlug).freeze();

// Placeholder elements for the lead paragraph and the embeds, from the markdown tree to the HTML tree.
const LEAD = 'bp-lead';
const EMBED = 'bp-embed';
const NO_LEAD = '[no-lead]';

interface Options {
	/** The markdown file, for error messages. */
	file: string;
	/** Its front matter, where the embeds find their data. */
	data: Record<string, unknown>;
	/** Turns a relative image path (./assets/…) into its built URL. */
	resolveAsset: (src: string) => string;
}

export function renderBody(markdown: string, { file, data, resolveAsset }: Options): RenderedBody {
	const mdast = processor.parse(markdown);
	markLead(mdast);
	const used = markEmbeds(mdast, file);
	const embedData = parseEmbedData(data, used, file, resolveAsset);
	const hast = processor.runSync(mdast) as HastRoot;
	decorate(hast, resolveAsset);
	return split(hast, embedData);
}

function isMarkerParagraph(node: Paragraph) {
	const [only] = node.children;
	return node.children.length === 1 && only.type === 'text' && markerName(only.value) !== null;
}

/** The first paragraph is the lead, unless it starts with [no-lead] (which is removed). */
function markLead(root: MdastRoot) {
	const first = root.children[0];
	if (first?.type !== 'paragraph' || isMarkerParagraph(first)) return;
	const head = first.children[0];
	if (head?.type === 'text' && head.value.startsWith(NO_LEAD)) {
		head.value = head.value.slice(NO_LEAD.length).trimStart();
		return;
	}
	first.data = { ...first.data, hName: LEAD };
}

/** Turns each marker paragraph into an embed placeholder. Fails on unknown, repeated or misplaced markers. */
function markEmbeds(root: MdastRoot, file: string): EmbedName[] {
	const used: EmbedName[] = [];
	for (const node of root.children) {
		if (node.type !== 'paragraph' || !isMarkerParagraph(node) || node.children[0].type !== 'text') continue;
		const name = markerName(node.children[0].value) ?? '';
		if (!isEmbedName(name)) {
			const known = Object.keys(EMBEDS).map((key) => `{{${key}}}`).join(', ');
			throw new Error(`${file}: unknown marker {{${name}}}. The markers are ${known}.`);
		}
		if (used.includes(name)) throw new Error(`${file}: the marker {{${name}}} appears twice; use it once.`);
		used.push(name);
		node.data = { hName: EMBED, hProperties: { dataEmbed: name } };
		node.children = [];
	}
	// What is left sits inside a paragraph with other text, or in a list, a quote or a table.
	const [stray] = markersIn(root);
	if (stray) throw new Error(`${file}: ${stray} must be a paragraph of its own, with a blank line before and after.`);
	return used;
}

/** The markers in the text of a markdown tree; code is not text, so markers in code are ignored. */
function markersIn(node: Nodes): string[] {
	if (node.type === 'text') return findMarkers(node.value);
	return 'children' in node ? node.children.flatMap(markersIn) : [];
}

/**
 * The data of every embed whose field is in the front matter, validated. A field without its
 * marker is not shown (a warning); a marker without its field is an error.
 */
function parseEmbedData(
	data: Record<string, unknown>,
	used: EmbedName[],
	file: string,
	resolveAsset: (src: string) => string
) {
	const parsed = new Map<EmbedName, unknown>();
	for (const [name, { field, parse }] of Object.entries(EMBEDS) as [EmbedName, (typeof EMBEDS)[EmbedName]][]) {
		if (data[field] === undefined) {
			if (used.includes(name)) throw new Error(`${file}: {{${name}}} needs the "${field}" list in the front matter.`);
			continue;
		}
		parsed.set(name, parse(data[field], { file, field, resolveAsset }));
		if (!used.includes(name)) {
			console.warn(`${file}: "${field}" is in the front matter, but {{${name}}} is not in the body, so the list is not shown.`);
		}
	}
	return parsed;
}

/**
 * Adds the classes of MARKDOWN_CLASSES, resolves the image paths and drops the links and images
 * whose URL has an unsafe scheme (javascript:, data:, …), since the HTML is injected as it is.
 */
function decorate(node: HastRoot | Element, resolveAsset: (src: string) => string) {
	for (const child of node.children) {
		if (child.type !== 'element') continue;
		const classes = MARKDOWN_CLASSES[child.tagName];
		if (classes) child.properties.className = [...classList(child.properties.className), ...classes.split(' ')];
		for (const attribute of ['href', 'src']) {
			const url = child.properties[attribute];
			if (typeof url === 'string' && !isSafeUrl(url)) delete child.properties[attribute];
		}
		if (child.tagName === 'img' && typeof child.properties.src === 'string') {
			child.properties.src = resolveAsset(child.properties.src);
		}
		decorate(child, resolveAsset);
	}
}

/** Relative URLs, fragments and the http, https, mailto and tel schemes. */
function isSafeUrl(url: string) {
	const scheme = url.trim().match(/^([a-z][a-z\d+.-]*):/i)?.[1].toLowerCase();
	return !scheme || ['http', 'https', 'mailto', 'tel'].includes(scheme);
}

function classList(value: unknown): string[] {
	if (Array.isArray(value)) return value.map(String);
	return typeof value === 'string' ? value.split(' ') : [];
}

/** Cuts the HTML tree at the embed placeholders and takes out the lead. */
function split(hast: HastRoot, embedData: Map<EmbedName, unknown>) {
	const segments: BodySegment[] = [];
	let lead: string | undefined;
	let html: RootContent[] = [];
	const flush = () => {
		if (html.some((node) => node.type !== 'text' || node.value.trim())) segments.push({ kind: 'html', html: toHtml(html) });
		html = [];
	};
	for (const node of hast.children) {
		if (node.type === 'element' && node.tagName === LEAD) {
			lead = toHtml(node.children);
		} else if (node.type === 'element' && node.tagName === EMBED) {
			flush();
			const name = String(node.properties.dataEmbed) as EmbedName;
			segments.push({ kind: 'embed', name, data: embedData.get(name) });
		} else {
			html.push(node);
		}
	}
	flush();
	return { lead, segments };
}
