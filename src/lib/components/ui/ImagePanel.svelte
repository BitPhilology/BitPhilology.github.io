<!--
	Image panel (Figma "Image panel"): an image shown as a duotone in the current category colour.
	The image is turned to greyscale, then screen-blended over a --cat-darker panel, so its dark
	parts take the panel colour and its light parts turn white; the greyscale keeps the colours of a
	photo from tinting the duotone. The 4 px white border covers the panel's edges. The effect
	expects dark line art on a light background. Used by ImageFiller and ImageContainer. `class`
	sizes the image.
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
		class={['block border-4 border-surface-white mix-blend-screen grayscale', className]}
	/>
</span>
