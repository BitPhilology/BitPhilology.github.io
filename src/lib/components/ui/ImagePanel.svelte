<!--
	Image panel (Figma "Image panel"): an image shown as a duotone in the current category colour.
	The image is screen-blended over a --cat-darker panel, so its dark lines take the panel colour and
	its light background turns white; the 4 px white border covers the panel's edges. The effect
	expects dark line art on a light background. Used by ImageFiller, and later by the Image
	Container of category pages. `class` sizes the image.
-->
<script lang="ts">
	import type { ClassValue } from 'svelte/elements';

	interface Props {
		src: string;
		alt: string;
		class?: ClassValue;
	}

	let { src, alt, class: className }: Props = $props();
</script>

<span class="isolate inline-block bg-(--cat-darker)">
	<img
		{src}
		{alt}
		loading="lazy"
		decoding="async"
		class={['block border-4 border-surface-white mix-blend-screen', className]}
	/>
</span>
