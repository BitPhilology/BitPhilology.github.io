<!--
	A pixelarticons icon (https://pixelarticons.com): 24×24 grid, drawn in the current text color.
	Import the raw SVG and pass it in, so that only the icons in use end up in the bundle:

		import mug from 'pixelarticons/svg/mug.svg?raw';

		<Icon svg={mug} class="size-12 text-pink-500" />
		<Icon svg={mug} label="Coffee break" />
-->
<script lang="ts">
	import type { SVGAttributes } from 'svelte/elements';

	interface Props extends SVGAttributes<SVGSVGElement> {
		/** The raw SVG, imported from `pixelarticons/svg/<name>.svg?raw`. */
		svg: string;
		/** Accessible name. Without it the icon is decorative and hidden from screen readers. */
		label?: string;
	}

	let { svg, label, ...rest }: Props = $props();

	// pixelarticons icons are made only of <path> elements, with `d` and sometimes `opacity`.
	const paths = $derived(
		[...svg.matchAll(/<path\b[^>]*>/g)].map(([tag]) => ({
			d: tag.match(/\sd="([^"]*)"/)?.[1],
			opacity: tag.match(/\sopacity="([^"]*)"/)?.[1]
		}))
	);
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	viewBox="0 0 24 24"
	width="24"
	height="24"
	fill="currentColor"
	shape-rendering="crispEdges"
	role={label ? 'img' : undefined}
	aria-label={label}
	aria-hidden={label ? undefined : 'true'}
	{...rest}
>
	{#each paths as { d, opacity }, index (index)}
		<path {d} {opacity} />
	{/each}
</svg>
