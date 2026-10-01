// The page index of post pages (column 1 of the grid at xl): "On this page", the headings of the
// body, and "In <Category>", every post of the same category with the current one marked. A list
// without links is left out, e.g. "On this page" for a body without headings.
import { categoryOf, dockEntry } from '$lib/categories';
import type { Heading, Post, PostLink } from '$lib/content/types';

export interface IndexLink extends PostLink {
	/** The page the reader is on (aria-current="page"). */
	current: boolean;
}

export interface IndexList {
	label: string;
	links: IndexLink[];
}

export function pageIndex(post: Post, headings: Heading[], section: PostLink[]): IndexList[] {
	const lists: IndexList[] = [
		{
			label: 'On this page',
			links: headings.map(({ id, text }) => ({ title: text, href: `#${id}`, current: false }))
		},
		{
			label: `In ${dockEntry(categoryOf(post.type)).dockLabel}`,
			links: section.map((link) => ({ ...link, current: link.href === post.href }))
		}
	];
	return lists.filter(({ links }) => links.length);
}
