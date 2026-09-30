// The category registry: the one list of content types and dock entries.
// Components read labels, icons, routes and colours from here. Do not list categories anywhere
// else, and do not branch on a category in components: add a field here instead.
import alarmClock from 'pixelarticons/svg/alarm-clock.svg?raw';
import home from 'pixelarticons/svg/home.svg?raw';
import printer from 'pixelarticons/svg/printer.svg?raw';
import robot from 'pixelarticons/svg/robot.svg?raw';
import sparkle from 'pixelarticons/svg/sparkle.svg?raw';
import { longDate, shortDate, yearOf } from '$lib/content/dates';
import type { Post } from '$lib/content/types';

/**
 * A colour theme and dock entry. `[data-category="…"]` in src/lib/styles/components.css maps each
 * one to the `--color-category-<category>-*` tokens (Home uses the neutral surface and text tokens).
 */
export type Category = 'home' | 'about' | 'event' | 'publication' | 'artifact';

/** The `type` of a post in its front matter. */
export type PostType = 'about' | 'team' | 'event' | 'publication' | 'artifact';

interface Entry {
	/** Label on post headers and category signifiers, e.g. "Event". */
	label: string;
	/** Raw pixelarticons SVG. */
	icon: string;
	/** The list page of the entry; its posts live below it, e.g. /events/<slug>. */
	route: string;
	/** Colour theme, and the dock entry that stands for this entry. */
	category: Category;
	/** Label in the navigation dock, e.g. "Events"; null when the entry has no dock item. */
	dockLabel: string | null;
	/** Whether the dock item opens a page sheet (the list of posts) or links to `route`. */
	sheet: boolean;
}

/** The line under the title of a stacked card: `subtitle` is the card/subtitle style, `body` body/body. */
export interface CardDescription {
	text: string;
	style: 'subtitle' | 'body';
}

interface PostEntry extends Entry {
	card: {
		/** stacked: title over a description · two-column: title beside authors and venue. */
		body: 'stacked' | 'two-column';
		/** Long text fades out at the bottom of the card. */
		fade: boolean;
		description: (post: Post) => CardDescription | undefined;
		/** The pills of the meta row, next to the arrow. */
		pills: (post: Post) => string[];
	};
	page: {
		/** The pills of the meta row of the post page, after the category signifier. */
		pills: (post: Post) => string[];
	};
}

const excerpt = (post: Post): CardDescription | undefined =>
	post.excerpt ? { text: post.excerpt, style: 'body' } : undefined;
const present = (values: (string | undefined)[]) => values.filter((value): value is string => !!value);
const hashtags = (post: Post) => post.keywords.map((keyword) => `#${keyword}`);
// The publication date and the keywords, as in the meta row of the Team frames.
const published = (date: string) => (date.includes('-') ? `Published on ${longDate(date)}` : `Published in ${date}`);
const PAGE = { pills: (post: Post) => present([post.date && published(post.date), ...hashtags(post)]) };

const HOME: Entry = { label: 'Home', icon: home, route: '/', category: 'home', dockLabel: 'Home', sheet: false };

export const POST_TYPES: Record<PostType, PostEntry> = {
	about: {
		label: 'About',
		icon: robot,
		route: '/about',
		category: 'about',
		dockLabel: 'About',
		sheet: true,
		card: { body: 'stacked', fade: true, description: excerpt, pills: () => [] },
		page: PAGE
	},
	// Team counts as About for the dock, the page sheet and the colours.
	team: {
		label: 'Team',
		icon: robot,
		route: '/about/team',
		category: 'about',
		dockLabel: null,
		sheet: true,
		card: { body: 'stacked', fade: true, description: excerpt, pills: () => [] },
		page: PAGE
	},
	event: {
		label: 'Event',
		icon: alarmClock,
		route: '/events',
		category: 'event',
		dockLabel: 'Events',
		sheet: true,
		card: {
			body: 'stacked',
			fade: false,
			description: (post) => (post.subtitle ? { text: post.subtitle, style: 'subtitle' } : undefined),
			pills: (post) => present([post.date && shortDate(post.date), post.location ?? post.venue])
		},
		page: PAGE
	},
	publication: {
		label: 'Publication',
		icon: printer,
		route: '/publications',
		category: 'publication',
		dockLabel: 'Publications',
		sheet: true,
		card: {
			body: 'two-column',
			fade: false,
			description: () => undefined,
			pills: (post) => present([post.date && yearOf(post.date), post.publicationType])
		},
		page: PAGE
	},
	artifact: {
		label: 'Artifact',
		icon: sparkle,
		route: '/artifacts',
		category: 'artifact',
		dockLabel: 'Artifacts',
		sheet: true,
		card: {
			body: 'stacked',
			fade: false,
			description: (post) => (post.authors ? { text: post.authors, style: 'body' } : excerpt(post)),
			pills: (post) => present([post.kind, ...hashtags(post)])
		},
		page: PAGE
	}
};

/** The dock items, in order: Home first, then every entry with a dock label. */
export const DOCK: (Entry & { dockLabel: string })[] = [HOME, ...Object.values(POST_TYPES)].filter(
	(entry): entry is Entry & { dockLabel: string } => entry.dockLabel !== null
);

/** The entry that stands for a category in the dock. */
export function dockEntry(category: Category) {
	const entry = DOCK.find((item) => item.category === category);
	if (!entry) throw new Error(`No dock entry for category "${category}".`);
	return entry;
}

export function isPostType(value: unknown): value is PostType {
	return typeof value === 'string' && Object.hasOwn(POST_TYPES, value);
}

/** The category of a post type (team → about). */
export function categoryOf(type: PostType): Category {
	return POST_TYPES[type].category;
}

/** The category of a URL: the entry whose route is the longest prefix of the path; Home otherwise. */
export function categoryForPath(pathname: string): Category {
	const match = Object.values(POST_TYPES)
		.filter(({ route }) => pathname === route || pathname.startsWith(`${route}/`))
		.sort((a, b) => b.route.length - a.route.length)[0];
	return match?.category ?? HOME.category;
}
