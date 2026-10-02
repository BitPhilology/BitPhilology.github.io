<!--
	Image panel (Figma "Image Base Instance" and "Image Filler Base Instance"): an image on a white
	frame, shown as a duotone in the current category colour. The image is turned to greyscale; an
	overlay in --cat-darker, as large as the frame, is screen-blended over it, so the dark parts of
	the image take the category colour while its light parts and the frame stay white. The image
	keeps its proportions and is never cropped (object-fit: contain); its 4 px white border is the
	one of the Figma image layer. `class` sets the size and the padding of the frame, `imageClass`
	sizes the image. Used by ImageFiller and ImageContainer.
-->
<script lang="ts">
	import type { ClassValue } from 'svelte/elements';

	interface Props {
		src: string;
		alt: string;
		class?: ClassValue;
		imageClass?: ClassValue;
	}

	let { src, alt, class: className, imageClass }: Props = $props();
</script>

<!-- isolate: the overlay blends with the frame and the image only, not with the page behind. -->
<div class={['relative isolate bg-surface-white', className]}>
	<img
		{src}
		{alt}
		loading="lazy"
		decoding="async"
		class={['border-4 border-surface-white object-contain grayscale', imageClass]}
	/>
	<span aria-hidden="true" class="pointer-events-none absolute inset-0 bg-(--cat-darker) mix-blend-screen"></span>
</div>
