<!--
	Category signifier (Figma "Category Signifier"): the icon and label of a category in an outlined
	chip. Used in the meta row of post pages.
-->
<script lang="ts">
	import { dockEntry, type Category } from '$lib/categories';
	import IconLabel from '$lib/components/ui/IconLabel.svelte';
	import { TEXT } from '$lib/styles/text';
	import CategoryTheme from './CategoryTheme.svelte';

	let { category }: { category: Category } = $props();

	const entry = $derived(dockEntry(category));
</script>

<CategoryTheme {category}>
	<IconLabel
		icon={entry.icon}
		label={entry.dockLabel}
		class={[
			'inline-flex gap-1 border border-(--cat-darker) bg-surface-white px-1 py-0.5 text-(--cat-darker)',
			TEXT['pixel/metadata']
		]}
	/>
</CategoryTheme>
