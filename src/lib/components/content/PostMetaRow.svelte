<!--
	Post meta row (Figma "Post Meta" of the page frames): the category signifier and the pills of a
	post page. It wraps on phones; from lg it stays on one line, with a thin line in the category
	colour between the signifier and the pills. The registry says which pills a post type shows.
-->
<script lang="ts">
	import { POST_TYPES, categoryOf } from '$lib/categories';
	import Pill from '$lib/components/ui/Pill.svelte';
	import type { Post } from '$lib/content/types';
	import CategorySignifier from './CategorySignifier.svelte';

	let { post }: { post: Post } = $props();

	const pills = $derived(POST_TYPES[post.type].page.pills(post));
</script>

<div class="flex flex-wrap items-center gap-2 lg:flex-nowrap lg:gap-4">
	<CategorySignifier category={categoryOf(post.type)} />
	<span aria-hidden="true" class="hidden h-px flex-1 bg-(--cat-darker) lg:block"></span>
	{#each pills as pill, index (index)}
		<Pill label={pill} />
	{/each}
</div>
