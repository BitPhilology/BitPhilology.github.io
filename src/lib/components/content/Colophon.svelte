<!--
	Colophon (Figma "Colophon"): the project statement, the first tile of the footer.
-->
<script lang="ts">
	import Tile from '$lib/components/ui/Tile.svelte';
	import { COLOPHON } from '$lib/config/footer';
	import { TEXT } from '$lib/styles/text';
</script>

<Tile
	surface="tinted"
	class={['flex items-center justify-center px-12 text-center text-category-artifact-darker', TEXT['body/body-lg']]}
>
	<p>{COLOPHON}</p>
	<!-- Not a link yet: there is no credits page. -->
	<p class="absolute right-5 bottom-5 hidden">Credits</p>
</Tile>
