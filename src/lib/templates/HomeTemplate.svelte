<!--
	Home page template: one TileGrid with the tiles in the order of src/lib/config/home.ts (posts,
	and the image fillers at their positions, the logo filler first), followed by the footer tiles,
	in a Container that keeps each breakpoint's layout until the next one, as in the Figma frames.
-->
<script lang="ts">
	import ImageFiller from '$lib/components/content/ImageFiller.svelte';
	import PostCard from '$lib/components/content/PostCard.svelte';
	import Container from '$lib/components/layout/Container.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import TileGrid from '$lib/components/layout/TileGrid.svelte';
	import { tileKey, type HomeTile } from '$lib/config/home';

	let { tiles }: { tiles: HomeTile[] } = $props();
</script>

<Container element="main" class="pt-6 pb-4">
	<h1 class="sr-only">Bit Philology</h1>
	<TileGrid>
		{#each tiles as tile (tileKey(tile))}
			{#if tile.kind === 'post'}
				<PostCard post={tile.post} />
			{:else}
				<ImageFiller accent={tile.filler.accent} {...tile.filler.image} />
			{/if}
		{/each}
		<Footer />
	</TileGrid>
</Container>
