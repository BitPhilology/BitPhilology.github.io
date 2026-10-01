<!--
	Image container (Figma "Image Container"): an image panel on a white frame with 16 px padding,
	the image of a post page. The panel takes the current category colour, as the Figma "Category"
	variants do. The image keeps its proportions and fills the width; a smaller image keeps its own
	size, centred, so it is never enlarged. `class` places the container.
-->
<script lang="ts">
	import type { ClassValue } from 'svelte/elements';
	import ImagePanel from './ImagePanel.svelte';

	let { src, alt, class: className }: { src: string; alt: string; class?: ClassValue } = $props();
</script>

<div class={['flex justify-center bg-surface-white p-4', className]}>
	<ImagePanel {src} {alt} class="h-auto w-full" />
</div>
