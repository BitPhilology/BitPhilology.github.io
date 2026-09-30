// The content model: what the loader (src/lib/server/content.ts) reads from src/content.
import type { Category, PostType } from '$lib/categories';

/** A post: src/content/<section>/<slug>/index.md, any type except home-image-filler. */
export interface Post {
	type: PostType;
	/** Folder relative to src/content, e.g. "events/digital-forensics-in-the-humanities". */
	path: string;
	/** The URL of the post page: the folder path. */
	href: string;
	title: string;
	subtitle?: string;
	/** `YYYY-MM-DD`, or `YYYY`. */
	date?: string;
	/** The `excerpt:` field, or else the first paragraph of the body as plain text. */
	excerpt: string;
	/** Pinned posts come first on Home. */
	pinned: boolean;
	/** Publications and artifacts, e.g. "E. Spadini, E. Barchielli". */
	authors?: string;
	/** Publication venue, or where an event takes place. */
	venue?: string;
	/** Events: where it takes place, when it differs from `venue`. */
	location?: string;
	/** Publications, e.g. "poster". */
	publicationType?: string;
	/** Artifacts: shown as pills. */
	keywords: string[];
	/** Artifacts: what kind of object it is, shown as the first pill. */
	kind?: string;
}

/** The categories an image filler can take its colour from. */
export type FillerAccent = Exclude<Category, 'home'>;

/** A Home image filler: src/content/home-image-fillers/<note id>/index.md, whose body is one image. */
export interface ImageFillerContent {
	/** The markdown file, for error messages. */
	file: string;
	accent: FillerAccent;
	/** 1-based index in the final Home grid; 1 is the first tile (the logo filler). */
	position: number;
	image: { src: string; alt: string };
}

/** A post in the list of the dock's page sheet. */
export interface PostLink {
	title: string;
	href: string;
}

/** A person in a member list of the Team page: an entry of `members` or `advisory_board`. */
export interface Member {
	name: string;
	role: string;
	affiliation?: string;
	/** The image URL: a localised ./assets/ file, resolved to its built URL, or a remote placeholder. */
	photo?: string;
	/** The member's page elsewhere, linked from the name. */
	externalURL?: string;
}

/**
 * A part of a rendered body: HTML rendered from the markdown, or an embed that the body places
 * with a marker such as {{team}} (src/lib/embeds.ts).
 */
export type BodySegment =
	| { kind: 'html'; html: string }
	| { kind: 'embed'; name: string; data: unknown };

/** The body of a post, rendered at build time by src/lib/server/markdown.ts. */
export interface RenderedBody {
	/** The HTML inside the lead paragraph (the first paragraph, unless it starts with [no-lead]). */
	lead?: string;
	segments: BodySegment[];
}

/** What a post page gets: the post and its rendered body. */
export interface PostPage {
	post: Post;
	body: RenderedBody;
}
