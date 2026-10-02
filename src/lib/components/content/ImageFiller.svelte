<!--
	Image filler (Figma "Image Filler"; the illustrations and the logo tile): an image from
	src/content/home-image-fillers as a Home tile. An image panel in the accent colour that covers
	the whole tile: a white frame with 64 px padding, in which the image takes the space left and
	keeps its proportions.
-->
<script lang="ts">
	import ImagePanel from '$lib/components/ui/ImagePanel.svelte';
	import Tile from '$lib/components/ui/Tile.svelte';
	import type { FillerAccent } from '$lib/content/types';
	import CategoryTheme from './CategoryTheme.svelte';

	let { accent, src, alt }: { accent: FillerAccent; src: string; alt: string } = $props();
</script>

<CategoryTheme category={accent}>
	<Tile element="figure">
		<!-- Over the tile's own padding, and with a definite size for the panel to fill. -->
		<div class="absolute inset-0">
			<ImagePanel {src} {alt} class="size-full p-16" imageClass="size-full" />
		</div>
	</Tile>
</CategoryTheme>
