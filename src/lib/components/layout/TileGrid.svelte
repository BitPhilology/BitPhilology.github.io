<!--
	Tile grid: the grid of square tiles on Home and in the footer. 1, 2, 3 and 4 columns at the base,
	sm, lg and xl breakpoints (the Figma frames 375, 640, 1024 and 1280), with 16 px gaps.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
	{@render children()}
</div>
