// Small markdown helpers for the loader. They extract plain text and images; they do not render.

const FRONT_MATTER = /^---[ \t]*\r?\n(?:([\s\S]*?)\r?\n)?---[ \t]*(?:\r?\n|$)/;

/** A markdown image: ![alt](url "optional title"); the title may start on the next line. */
const IMAGE = /!\[([^\]]*)\]\(\s*(<[^>\n]*>|[^\s)]+)(?:\s+(?:"[^"]*"|'[^']*'|\([^)]*\)))?\s*\)/g;

/** Splits a markdown file into its front matter (raw YAML) and its body. */
export function splitFrontMatter(markdown: string) {
	const match = markdown.match(FRONT_MATTER);
	return { frontMatter: match?.[1] ?? '', body: match ? markdown.slice(match[0].length) : markdown };
}

/** The first paragraph of a body that holds text, as plain text. */
export function firstParagraph(body: string): string {
	for (const block of body.split(/\n[ \t]*\n/)) {
		const trimmed = block.trim();
		// Headings, footnote definitions, lists, quotes and code are not a lead paragraph.
		if (!trimmed || /^(#|\[\^|[-*+] |\d+\. |>|```|~~~|<!--)/.test(trimmed)) continue;
		const text = toPlainText(trimmed.replace(/^\[no-lead\]\s*/, ''));
		if (text) return text;
	}
	return '';
}

/** Plain text of a markdown fragment. Deleted text (~~…~~), images and footnote references go. */
export function toPlainText(markdown: string): string {
	return markdown
		.replace(/~~[\s\S]*?~~/g, '')
		.replace(IMAGE, '')
		.replace(/\[\^[^\]]+\]/g, '')
		.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
		.replace(/<[^>]+>/g, '')
		.replace(/(\*\*|__|\*|`)/g, '')
		.replace(/(^|[^\w])_([^_]+)_(?=[^\w]|$)/g, '$1$2')
		.replace(/\s+/g, ' ')
		.trim();
}

/**
 * The only content of a body that must be exactly one image. Returns the image, or the reason
 * why the body does not qualify.
 */
export function soleImage(body: string): { src: string; alt: string } | { error: string } {
	const images = [...body.matchAll(IMAGE)];
	if (images.length !== 1) {
		return { error: `the body must hold exactly one image, but it has ${images.length || 'none'}` };
	}
	const [image] = images;
	const rest = (body.slice(0, image.index) + body.slice(image.index + image[0].length)).trim();
	if (rest) return { error: `the body must hold only the image, but it also has "${rest.slice(0, 60)}"` };
	const alt = image[1].trim();
	if (!alt) return { error: 'the image has no alt text' };
	return { src: image[2].replace(/^<|>$/g, ''), alt };
}
