// The page template of each post type. Types with a page of their own are listed here; the others
// use PostTemplate. Every template takes a PostPage.
import type { Component } from 'svelte';
import type { PostType } from '$lib/categories';
import type { PostPage } from '$lib/content/types';
import PostTemplate from './PostTemplate.svelte';
import TeamTemplate from './TeamTemplate.svelte';

const TEMPLATES: Partial<Record<PostType, Component<{ page: PostPage }>>> = {
	team: TeamTemplate
};

export function templateFor(type: PostType): Component<{ page: PostPage }> {
	return TEMPLATES[type] ?? PostTemplate;
}
