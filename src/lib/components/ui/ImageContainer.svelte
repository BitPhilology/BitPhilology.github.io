<!--
	Image container (Figma "Image Container"): the image of a post page, an image panel with 16 px
	padding in the current category colour, as the Figma "Category" variants do. The image fits the
	width and keeps its proportions; the frame is at most 432 px high (400 px of image), so a tall
	image is scaled down and centred. A smaller image keeps its own size, centred: it is never
	enlarged. `class` places the container.
-->
<script lang="ts">
	import type { ClassValue } from 'svelte/elements';
	import ImagePanel from './ImagePanel.svelte';

	let { src, alt, class: className }: { src: string; alt: string; class?: ClassValue } = $props();
</script>

<ImagePanel
	{src}
	{alt}
	class={['grid grid-cols-1 place-items-center p-4', className]}
	imageClass="max-h-100 max-w-full"
/>
