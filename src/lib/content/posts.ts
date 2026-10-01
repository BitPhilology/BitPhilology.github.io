// Turns the front matter and body of a markdown file into a Post, and orders posts.
import { isPostType } from '$lib/categories';
import { text } from './fields';
import { firstParagraph, toPlainText } from './markdown';
import type { Post } from './types';

type FrontMatter = Record<string, unknown>;

// Titles may hold markdown (e.g. *born-digital*); cards and lists show them as plain text.
const plain = (value: unknown) => {
	const raw = text(value);
	return raw && toPlainText(raw);
};

/**
 * A post from its folder (relative to src/content), front matter and body. Fails the build when a
 * required field is missing: `title`, the page's h1. Every other field may be missing.
 */
export function toPost(path: string, data: FrontMatter, body: string): Post {
	// `about` is the fallback type, as in the import script.
	const type = isPostType(data.type) ? data.type : 'about';
	const keywords = Array.isArray(data.keywords) ? data.keywords.map(String) : [];
	const title = plain(data.title);
	if (!title) throw new Error(`src/content/${path}/index.md: the front matter has no "title"; every page needs one.`);
	return {
		type,
		path,
		href: `/${path}`,
		title,
		subtitle: plain(data.subtitle),
		date: text(data.date),
		excerpt: text(data.excerpt) ?? firstParagraph(body),
		pinned: data.pinned === true,
		authors: text(data.authors),
		venue: text(data.venue),
		location: text(data.location),
		publicationType: text(data['publication-type']),
		keywords,
		kind: text(data.kind),
		doi: text(data.doi),
		downloadLink: text(data['download-link'])
	};
}

/** Newest first; posts without a date last. Dates are `YYYY-MM-DD` or `YYYY`, so they sort as text. */
export function byDate(a: Post, b: Post): number {
	return (b.date ?? '').localeCompare(a.date ?? '') || a.title.localeCompare(b.title);
}

/** Pinned posts first, then the others; each group newest first. */
export function pinnedThenByDate(a: Post, b: Post): number {
	return Number(b.pinned) - Number(a.pinned) || byDate(a, b);
}

/** Long publication titles use the smaller heading style on cards, as in the Figma Home frames. */
export const LONG_TITLE = 40;
