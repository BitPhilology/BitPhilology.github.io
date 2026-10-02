<!--
	Post card (Figma "Post"): the tile of a post on Home, and later on the category pages. A shared
	shell (the meta row at the top, and the fade of long text) around a body that the registry picks:
	stacked (title over a description) or two-column (publications). The title links to the post,
	and its link covers the whole card (CardLink).
-->
<script lang="ts">
	import { POST_TYPES, categoryOf } from '$lib/categories';
	import Tile from '$lib/components/ui/Tile.svelte';
	import type { Post } from '$lib/content/types';
	import CategoryTheme from './CategoryTheme.svelte';
	import PostBody from './PostBody.svelte';
	import PostMeta from './PostMeta.svelte';
	import PublicationBody from './PublicationBody.svelte';

	let { post }: { post: Post } = $props();

	const BODIES = { stacked: PostBody, 'two-column': PublicationBody };
	const entry = $derived(POST_TYPES[post.type]);
	const Body = $derived(BODIES[entry.card.body]);
</script>

<CategoryTheme category={categoryOf(post.type)}>
	<Tile element="article" surface="card" class="flex flex-col gap-3">
		<PostMeta icon={entry.icon} label={entry.label} pills={entry.card.pills(post)} />
		<Body {post} />
		{#if entry.card.fade}
			<div
				aria-hidden="true"
				class="pointer-events-none absolute inset-x-0 bottom-0 h-34 bg-linear-to-b from-surface-light-background/0 to-surface-light-background to-75%"
			></div>
		{/if}
	</Tile>
</CategoryTheme>
