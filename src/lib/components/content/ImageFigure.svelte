<!--
	Image figure (the Image Container and its caption, Figma "Sidenotes & Captions"): an image of a
	post body as one row of the page grid. The caption, the title of the markdown image, sits under
	the image below lg; from lg it is in the side column, at the bottom of the row, 16 px above the
	bottom of the image, with 64 px on its right to set it apart from the notes. The alt text is for
	screen readers; the caption is visible to all.
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
		<figcaption class={[GRID.aside, 'lg:self-end lg:pr-16 lg:pb-4', TEXT['pixel/caption']]}>
			{caption}
		</figcaption>
	{/if}
</figure>
