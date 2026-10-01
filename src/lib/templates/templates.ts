// The template registry: the header of each post type, the one place that says which header a
// page shows. Every post page is PostTemplate (the shell and the body blocks); the types differ
// only by their header and by their pills (POST_TYPES[type].page.pills in src/lib/categories.ts).
// Artifacts use the default header: in Figma their header is the same as About's.
import type { Component } from 'svelte';
import type { PostType } from '$lib/categories';
import EventHeader from '$lib/components/content/EventHeader.svelte';
import PageHeader from '$lib/components/content/PageHeader.svelte';
import PublicationHeader from '$lib/components/content/PublicationHeader.svelte';
import type { Post } from '$lib/content/types';

export const HEADERS: Record<PostType, Component<{ post: Post }>> = {
	about: PageHeader,
	team: PageHeader,
	event: EventHeader,
	publication: PublicationHeader,
	artifact: PageHeader
};
