<!--
	Top stroke (Figma "Top Stroke"): the dithered line fixed at the very top of the viewport, in the
	colour of the active category (neutral on Home), which the root layout's theme provides.
-->
<script lang="ts">
	import Dither from '$lib/components/ui/Dither.svelte';
</script>

<div class="fixed inset-x-0 top-0 z-30 bg-surface-white">
	<Dither />
</div>
