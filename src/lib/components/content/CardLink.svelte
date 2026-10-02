<!--
	Card link: the link of a post card, around its title. It stretches over the whole tile (its
	::after covers the nearest positioned ancestor, the Tile), so the card is one click target and one
	keyboard stop, named by the title. The focus ring is drawn on the stretched area, inside the tile,
	which clips what lies outside it.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';

	let { href, children }: { href: string; children: Snippet } = $props();
</script>

<a
	{href}
	class="after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-(--cat-darker)"
>
	{@render children()}
</a>
