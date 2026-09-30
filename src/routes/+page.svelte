<script lang="ts">
	import HomeTemplate from '$lib/templates/HomeTemplate.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Bit Philology</title>
</svelte:head>

<HomeTemplate tiles={data.tiles} />
