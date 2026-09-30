<!--
	Page shell (the grid of the page frames, e.g. Figma "Team"): the layout of every post page, in the
	post's category colours. One column on phones and at sm, three at lg, four at xl, with 16 px gaps:

	           meta row      header, body     notes
	   lg      cols 1–3      cols 1–2         col 3
	   xl      cols 1–4      cols 2–3         col 4

	The template fills the body (children) and, if it has them, the notes. The footer tiles follow
	in their own grid.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { categoryOf } from '$lib/categories';
	import CategoryTheme from '$lib/components/content/CategoryTheme.svelte';
	import PageHeader from '$lib/components/content/PageHeader.svelte';
	import PostMetaRow from '$lib/components/content/PostMetaRow.svelte';
	import type { Post } from '$lib/content/types';
	import Container from './Container.svelte';
	import Footer from './Footer.svelte';
	import TileGrid from './TileGrid.svelte';

	interface Props {
		post: Post;
		/** The HTML inside the lead paragraph. */
		lead?: string;
		notes?: Snippet;
		children?: Snippet;
	}

	let { post, lead, notes, children }: Props = $props();
</script>

<CategoryTheme category={categoryOf(post.type)}>
	<main class="min-h-screen bg-surface-light-background">
		<Container class="grid grid-cols-1 gap-4 pt-8 pb-4 text-(--cat-darker) lg:grid-cols-3 xl:grid-cols-4">
			<div class="lg:col-span-3 lg:row-start-1 xl:col-span-4">
				<PostMetaRow {post} />
			</div>
			<div class="lg:col-span-2 lg:row-start-2 xl:col-start-2">
				<PageHeader title={post.title} subtitle={post.subtitle} {lead} />
			</div>
			{#if children}
				<div class="lg:col-span-2 lg:row-start-3 xl:col-start-2">{@render children()}</div>
			{/if}
			{#if notes}
				<aside class="lg:col-start-3 lg:row-start-3 xl:col-start-4">{@render notes()}</aside>
			{/if}
		</Container>
		<Container class="pb-4">
			<TileGrid>
				<Footer />
			</TileGrid>
		</Container>
	</main>
</CategoryTheme>
