<script lang="ts">
	import '../app.css';
	// Mona Sans: weight axis only. If the width axis is ever needed, switch to standard.css and standard-italic.css.
	import '@fontsource-variable/mona-sans/wght.css';
	import '@fontsource-variable/mona-sans/wght-italic.css';
	// Bitcount Prop Single: all axes, custom ones included.
	import '@fontsource-variable/bitcount-prop-single/full.css';
	// JetBrains Mono: weight axis only.
	import '@fontsource-variable/jetbrains-mono/wght.css';
	import favicon from '$lib/assets/favicon.svg';
	import CategoryTheme from '$lib/components/content/CategoryTheme.svelte';
	import NavDock from '$lib/components/layout/NavDock.svelte';
	import TopStroke from '$lib/components/layout/TopStroke.svelte';
	import { activeCategory } from '$lib/navigation/activeCategory';

	let { data, children } = $props();

	const category = $derived(activeCategory());
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<!-- The page theme: the active category colours the top stroke, the dock and the focus rings. -->
<CategoryTheme {category}>
	<TopStroke />
	<!-- Before the page in the markup, so the keyboard and screen readers reach the navigation first. -->
	<NavDock sheets={data.sheets} active={category} />
	<!-- The padding keeps the page clear of the fixed dock: its end below lg, its start from lg. -->
	<div class="max-lg:pb-16 lg:pt-16">
		{@render children()}
	</div>
</CategoryTheme>
