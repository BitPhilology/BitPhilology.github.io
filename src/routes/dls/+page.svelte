<!-- Temporary test page for Tailwind, the self-hosted fonts, the semantic colours and the icons. Replace it with the real home page. -->
<script lang="ts">
	import bookOpen from 'pixelarticons/svg/book-open.svg?raw';
	import save from 'pixelarticons/svg/save.svg?raw';
	import heart from 'pixelarticons/svg/heart.svg?raw';
	import Icon from '$lib/components/Icon.svelte';

	// Full class names, so that Tailwind finds them in the source.
	const swatches = [
		'bg-category-about-lighter',
		'bg-category-about-main',
		'bg-category-about-darker',
		'bg-category-event-lighter',
		'bg-category-event-main',
		'bg-category-event-darker',
		'bg-category-publication-lighter',
		'bg-category-publication-main',
		'bg-category-publication-darker',
		'bg-category-artifact-lighter',
		'bg-category-artifact-main',
		'bg-category-artifact-darker',
		'bg-surface-light-background',
		'bg-surface-dark-background',
		'bg-surface-white',
		'bg-surface-subtle',
		'bg-text-neutral-on-light-bg',
		'bg-text-neutral-on-dark-bg'
	];
</script>

<main class="space-y-10 p-6">
	<section class="space-y-2">
		<h1 class="text-sm">Mona Sans Variable · font-sans</h1>
		<p class="text-3xl font-extralight">200 · Born-digital literary archives 0123456789</p>
		<p class="text-3xl font-extralight italic">200 italic · Born-digital literary archives 0123456789</p>
		<p class="text-3xl font-normal">400 · Born-digital literary archives 0123456789</p>
		<p class="text-3xl font-normal italic">400 italic · Born-digital literary archives 0123456789</p>
		<p class="text-3xl font-black">900 · Born-digital literary archives 0123456789</p>
		<p class="text-3xl font-black italic">900 italic · Born-digital literary archives 0123456789</p>
	</section>

	<section class="space-y-2">
		<h2 class="text-sm">Bitcount Prop Single Variable · font-pixel</h2>
		<p class="font-pixel text-3xl">Bit Philology 0123456789</p>
	</section>

	<section class="space-y-2">
		<h2 class="text-sm">JetBrains Mono Variable · font-mono</h2>
		<p class="font-mono text-xl font-normal">const source = 'https://pad.dsl.unibe.ch/&lt;id&gt;';</p>
		<p class="font-mono text-xl font-medium">0O 1lI {'{}'} [] () =&gt; != ===</p>
	</section>

	<section class="space-y-2">
		<h2 class="text-sm">bg-pink-500</h2>
		<div class="size-24 bg-pink-500"></div>
	</section>

	<section class="space-y-2">
		<h2 class="text-sm">Semantic colours</h2>
		<div class="grid grid-cols-3 gap-2 sm:grid-cols-6">
			{#each swatches as swatch (swatch)}
				<div class="space-y-1">
					<div class="h-12 border border-neutral-200 {swatch}"></div>
					<p class="font-mono text-xs break-all">{swatch.slice(3)}</p>
				</div>
			{/each}
		</div>
	</section>

	<section class="space-y-2">
		<h2 class="text-sm">pixelarticons · Icon</h2>
		<div class="flex items-end gap-6">
			<Icon svg={bookOpen} />
			<Icon svg={bookOpen} class="size-12" />
			<Icon svg={heart} class="size-12 text-pink-500" label="Heart" />
			<Icon svg={save} class="size-18" />
		</div>
	</section>
</main>
