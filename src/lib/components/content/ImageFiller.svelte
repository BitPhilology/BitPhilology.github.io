<!--
	Image filler (Figma "Image Filler"; floppy, disk, folder, magnetic, and the logo tile): an image
	from src/content/home-image-fillers as a Home tile, a duotone in its accent colour, with no
	background of its own. The tile is a size container: it is square, so 100cqw caps the image at
	the tile's inner size in both directions, whatever its proportions.
-->
<script lang="ts">
	import ImagePanel from '$lib/components/ui/ImagePanel.svelte';
	import Tile from '$lib/components/ui/Tile.svelte';
	import type { FillerAccent } from '$lib/content/types';
	import CategoryTheme from './CategoryTheme.svelte';

	let { accent, src, alt }: { accent: FillerAccent; src: string; alt: string } = $props();
</script>

<CategoryTheme category={accent}>
	<Tile element="figure" class="@container flex items-center justify-center">
		<ImagePanel {src} {alt} class="max-h-[100cqw] max-w-[100cqw]" />
	</Tile>
</CategoryTheme>
