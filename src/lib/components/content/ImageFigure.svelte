<!--
	Image figure (the Image Container and its caption in the page frames): an image of a post body
	as one row of the page grid. The caption, the title of the markdown image, sits in the notes
	column from lg, aligned to the bottom of the image (the 16 px of the container's frame), and
	under the image below lg. The alt text is for screen readers; the caption is visible to all.
-->
<script lang="ts">
	import ImageContainer from '$lib/components/ui/ImageContainer.svelte';
	import { GRID } from '$lib/styles/grid';
	import { TEXT } from '$lib/styles/text';

	let { src, alt, caption }: { src: string; alt: string; caption?: string } = $props();
</script>

<figure class={GRID.row}>
	<ImageContainer {src} {alt} class={GRID.content} />
	{#if caption}
		<figcaption class={[GRID.aside, 'lg:flex lg:flex-col lg:justify-end lg:pb-4', TEXT['pixel/caption']]}>
			{caption}
		</figcaption>
	{/if}
</figure>
