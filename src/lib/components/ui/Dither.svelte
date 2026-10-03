<!--
	Dither: the 8 px dithered strip of the top stroke and of the active dock item's cap. It is in the
	current category's main colour, as the top stroke; `class` sets another one with a background
	utility, as the dock cap does. The pattern is in src/lib/styles/components.css (.dither).
-->
<script lang="ts">
	import type { ClassValue } from 'svelte/elements';

	let { class: className }: { class?: ClassValue } = $props();
</script>

<span aria-hidden="true" class={['dither block h-2 w-full', className]}></span>
