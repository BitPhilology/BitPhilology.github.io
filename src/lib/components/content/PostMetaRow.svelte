<!--
	Post meta row (Figma "Post Meta" of the page frames): the category signifier and the pills of a
	post page. Below lg everything wraps as one flow; from lg a thin line in the category colour
	fills the space between the signifier and the pills, which wrap on the right if they do not fit.
	The registry gives the pills of each post type (POST_TYPES[type].page.pills).
-->
<script lang="ts">
	import type { Category } from '$lib/categories';
	import Pill from '$lib/components/ui/Pill.svelte';
	import CategorySignifier from './CategorySignifier.svelte';

	let { category, pills }: { category: Category; pills: string[] } = $props();
</script>

<div class="flex flex-wrap items-center gap-2 lg:flex-nowrap lg:gap-4">
	<CategorySignifier {category} />
	<span aria-hidden="true" class="hidden h-px min-w-4 flex-1 bg-(--cat-darker) lg:block"></span>
	<!-- No box below lg (contents), so the pills flow with the signifier, as in the phone frames. -->
	<div class="contents lg:flex lg:min-w-0 lg:flex-wrap lg:justify-end lg:gap-4">
		{#each pills as pill, index (index)}
			<Pill label={pill} />
		{/each}
	</div>
</div>
