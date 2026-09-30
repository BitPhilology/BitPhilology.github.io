<!--
	Tile: the square cell of the tile grids (Home, footer). It gives the square proportion, the
	surface and the padding; the content comes from the parent. Used by PostCard, ImageFiller,
	Colophon and PartnerLogo.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type Surface = 'card' | 'tinted' | 'none';

	interface Props extends HTMLAttributes<HTMLElement> {
		/** card: the neutral background of posts · tinted: the About tint of the footer tiles · none. */
		surface?: Surface;
		element?: 'article' | 'figure' | 'div';
		children: Snippet;
	}

	let { surface = 'none', element = 'div', class: className, children, ...rest }: Props = $props();

	const SURFACES: Record<Surface, string> = {
		card: 'bg-surface-light-background',
		tinted: 'bg-category-about-lighter',
		none: ''
	};
</script>

<svelte:element
	this={element}
	class={['relative aspect-square overflow-hidden p-4', SURFACES[surface], className]}
	{...rest}
>
	{@render children()}
</svelte:element>
