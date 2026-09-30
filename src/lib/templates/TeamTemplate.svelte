<!--
	Team page template (Figma page "Team"): the page shell with the markdown body, where the {{team}}
	and {{advisory-board}} markers place the member lists.
-->
<script lang="ts">
	import MarkdownBody from '$lib/components/content/MarkdownBody.svelte';
	import PageShell from '$lib/components/layout/PageShell.svelte';
	import type { PostPage } from '$lib/content/types';

	let { page }: { page: PostPage } = $props();
</script>

<PageShell post={page.post} lead={page.body.lead}>
	<MarkdownBody segments={page.body.segments} />
</PageShell>
