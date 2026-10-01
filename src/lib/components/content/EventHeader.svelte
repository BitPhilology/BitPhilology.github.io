<!--
	Event header (Figma "Page Header" of the Events frames): the default header with two lines under
	the subtitle, in heading/h6: where the event takes place and its date (eventDetails). A missing
	field leaves its line out.
-->
<script lang="ts">
	import { eventDetails } from '$lib/content/details';
	import type { Post } from '$lib/content/types';
	import { TEXT } from '$lib/styles/text';
	import PageHeader from './PageHeader.svelte';

	let { post }: { post: Post } = $props();

	const details = $derived(eventDetails(post));
</script>

<PageHeader {post}>
	{#if details.length}
		<dl class="flex flex-col gap-4">
			{#each details as { term, value } (term)}
				<div class={TEXT['heading/h6']}>
					<dt class="inline">{term}:</dt>
					<dd class="inline">{value}</dd>
				</div>
			{/each}
		</dl>
	{/if}
</PageHeader>
