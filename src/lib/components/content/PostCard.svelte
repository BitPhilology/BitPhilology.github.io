<!--
	Post card (Figma "Post"): the tile of a post on Home, and later on the category pages. A shared
	shell (header, meta row, and the fade of long text) around a body that the registry picks:
	stacked (title over a description) or two-column (publications).
-->
<script lang="ts">
	import { POST_TYPES, categoryOf } from '$lib/categories';
	import Tile from '$lib/components/ui/Tile.svelte';
	import type { Post } from '$lib/content/types';
	import CategoryTheme from './CategoryTheme.svelte';
	import PostBody from './PostBody.svelte';
	import PostHeader from './PostHeader.svelte';
	import PostMeta from './PostMeta.svelte';
	import PublicationBody from './PublicationBody.svelte';

	let { post }: { post: Post } = $props();

	const BODIES = { stacked: PostBody, 'two-column': PublicationBody };
	const card = $derived(POST_TYPES[post.type].card);
	const Body = $derived(BODIES[card.body]);
</script>

<CategoryTheme category={categoryOf(post.type)}>
	<Tile element="article" surface="card" class="flex flex-col gap-3">
		<PostHeader type={post.type} />
		<Body {post} />
		{#if card.fade}
			<div
				aria-hidden="true"
				class="pointer-events-none absolute inset-x-0 bottom-0 h-30 bg-linear-to-b from-surface-light-background/0 to-surface-light-background to-75%"
			></div>
		{/if}
		<PostMeta pills={card.pills(post)} href={post.href} title={post.title} />
	</Tile>
</CategoryTheme>
