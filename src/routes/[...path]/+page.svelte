<script lang="ts">
	import { templateFor } from '$lib/templates/templates';

	let { data } = $props();

	const Template = $derived(templateFor(data.page.post.type));
</script>

<svelte:head>
	<title>{data.page.post.title} · Bit Philology</title>
</svelte:head>

<Template page={data.page} />
