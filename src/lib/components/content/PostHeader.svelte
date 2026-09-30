<!--
	Post header (Figma "Post Header"): the top row of a post card, the type's icon, its label and the
	icon again, in the current category colour.
-->
<script lang="ts">
	import { POST_TYPES, type PostType } from '$lib/categories';
	import Icon from '$lib/components/Icon.svelte';
	import { TEXT } from '$lib/styles/text';

	let { type }: { type: PostType } = $props();

	const entry = $derived(POST_TYPES[type]);
</script>

<header class="flex h-6 shrink-0 items-center gap-1 text-(--cat-darker)">
	<Icon svg={entry.icon} />
	<p class={['flex-1 text-center', TEXT['pixel/metadata']]}>{entry.label}</p>
	<Icon svg={entry.icon} />
</header>
