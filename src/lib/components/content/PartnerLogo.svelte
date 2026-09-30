<!--
	Partner logo (Figma "Partner Logo"): a partner's logo on the footer tint, linking to its website.
-->
<script lang="ts">
	import Tile from '$lib/components/ui/Tile.svelte';
	import type { Partner } from '$lib/config/footer';

	let { partner }: { partner: Partner } = $props();
</script>

<Tile surface="tinted" class="flex items-center justify-center">
	<a href={partner.href}>
		<img src={partner.logo} alt={partner.name} loading="lazy" class={['h-auto', partner.width]} />
	</a>
</Tile>
