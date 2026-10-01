<!--
	Page header (Figma "Page Header" of the About, Team and Artifacts frames): the default header of
	a post page. The page's only h1, heading/h1 on phones and display/page-title from sm, then the
	subtitle in body/lead-paragraph. Headers of other types add their lines below (children), e.g.
	EventHeader. The lead paragraph is the first block of the body, not part of the header.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Post } from '$lib/content/types';
	import { PAGE_TITLE, TEXT } from '$lib/styles/text';

	let { post, children }: { post: Post; children?: Snippet } = $props();
</script>

<header class="flex flex-col gap-4">
	<h1 class={PAGE_TITLE}>{post.title}</h1>
	{#if post.subtitle}<p class={TEXT['body/lead-paragraph']}>{post.subtitle}</p>{/if}
	{@render children?.()}
</header>
