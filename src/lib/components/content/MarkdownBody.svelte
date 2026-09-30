<!--
	Markdown body: the body of a post page, rendered at build time (src/lib/server/markdown.ts) as a
	list of segments, HTML from the markdown and embeds (src/lib/embeds.ts), in the order the editor
	wrote them. The HTML elements and the embeds are all children of one column, so the 16 px gap of
	the page frames separates every block.
-->
<script lang="ts">
	import type { BodySegment } from '$lib/content/types';
	import { embedView } from '$lib/embeds';

	let { segments }: { segments: BodySegment[] } = $props();
</script>

<div class="flex flex-col gap-4">
	{#each segments as segment, index (index)}
		{#if segment.kind === 'html'}
			<!-- Built from the repository's markdown with raw HTML dropped, so it is safe to inject. -->
			{@html segment.html}
		{:else}
			{@const { component: Embed, props } = embedView(segment.name, segment.data)}
			<Embed {...props} />
		{/if}
	{/each}
</div>
