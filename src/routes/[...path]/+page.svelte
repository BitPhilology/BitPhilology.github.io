<script lang="ts">
	import PostTemplate from '$lib/templates/PostTemplate.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>{data.page.post.title} · Bit Philology</title>
</svelte:head>

<PostTemplate page={data.page} />
