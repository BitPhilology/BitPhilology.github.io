<!--
	Footer (Figma "Footer"): the colophon and the partner logo tiles. It has no grid of its own
	(display: contents), so its tiles flow in the surrounding TileGrid: after the posts on Home, alone
	on other pages.
-->
<script lang="ts">
	import Colophon from '$lib/components/content/Colophon.svelte';
	import PartnerLogo from '$lib/components/content/PartnerLogo.svelte';
	import { PARTNERS } from '$lib/config/footer';
</script>

<footer class="contents">
	<Colophon />
	{#each PARTNERS as partner (partner.partner)}
		<PartnerLogo {partner} />
	{/each}
</footer>
