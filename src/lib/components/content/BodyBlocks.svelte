<!--
	Body blocks: the body of a post page, rendered at build time (src/lib/server/markdown.ts) as a
	list of blocks in the editor's order. Each block is one row of the page grid (src/lib/styles/
	grid.ts): text with its notes, an image with its caption, or an embed placed by a marker such as
	{{team}} (src/lib/embeds.ts). The rows are children of the article's grid, whose gap spaces them.
-->
<script lang="ts">
	import type { BodyBlock } from '$lib/content/types';
	import { embedView } from '$lib/embeds';
	import { GRID } from '$lib/styles/grid';
	import ImageFigure from './ImageFigure.svelte';
	import TextBlock from './TextBlock.svelte';

	let { blocks }: { blocks: BodyBlock[] } = $props();
</script>

{#each blocks as block, index (index)}
	{#if block.kind === 'html'}
		<TextBlock html={block.html} notes={block.notes} />
	{:else if block.kind === 'figure'}
		<ImageFigure src={block.src} alt={block.alt} caption={block.caption} />
	{:else}
		{@const { component: Embed, props } = embedView(block.name, block.data)}
		<div class={GRID.row}>
			<div class={GRID.content}><Embed {...props} /></div>
		</div>
	{/if}
{/each}
