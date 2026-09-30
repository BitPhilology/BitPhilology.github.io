<!--
	Category theme: sets the colour theme of everything inside. data-category maps --cat-lighter,
	--cat-main and --cat-darker to the tokens (src/lib/styles/components.css). The wrapper has no box
	of its own (display: contents), so it never changes the layout, e.g. of a grid.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Category } from '$lib/categories';

	let { category, children }: { category: Category; children: Snippet } = $props();
</script>

<div class="contents" data-category={category}>
	{@render children()}
</div>
