<!--
	Post page template (provisional, for the types without a template of their own): the page shell
	with the meta row, the title and the lead paragraph, then the footer. The body, the index and
	the notes column come with the category pages.
-->
<script lang="ts">
	import PageShell from '$lib/components/layout/PageShell.svelte';
	import type { PostPage } from '$lib/content/types';

	let { page }: { page: PostPage } = $props();
</script>

<PageShell post={page.post} lead={page.body.lead} />
