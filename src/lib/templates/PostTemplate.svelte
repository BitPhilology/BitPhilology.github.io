<!--
	Post page template, for every post type (Figma pages About, Team, Events, Artifacts and
	Publications): the page shell with the header of the type (HEADERS in templates.ts) and the body
	as blocks. The types differ only by their header and their pills (src/lib/categories.ts).
-->
<script lang="ts">
	import BodyBlocks from '$lib/components/content/BodyBlocks.svelte';
	import PageShell from '$lib/components/layout/PageShell.svelte';
	import type { PostPage } from '$lib/content/types';
	import { HEADERS } from './templates';

	let { page }: { page: PostPage } = $props();

	const Header = $derived(HEADERS[page.post.type]);
</script>

<PageShell {page}>
	{#snippet header()}
		<Header post={page.post} />
	{/snippet}
	<BodyBlocks blocks={page.body.blocks} />
</PageShell>
