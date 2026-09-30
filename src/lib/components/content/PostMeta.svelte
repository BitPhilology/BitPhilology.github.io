<!--
	Post meta (Figma "Post Meta"): the bottom row of a post card, the pills and then the arrow link
	to the post. Without pills, as on About and Team cards, the arrow is centred.
-->
<script lang="ts">
	import arrowRight from 'pixelarticons/svg/arrow-right.svg?raw';
	import Pill from '$lib/components/ui/Pill.svelte';

	interface Props {
		pills: string[];
		href: string;
		/** The post title, to name the arrow link. */
		title: string;
	}

	let { pills, href, title }: Props = $props();
</script>

<div class={['relative flex shrink-0 items-center gap-2', !pills.length && 'justify-center']}>
	{#if pills.length}
		<ul class="flex min-w-0 flex-1 gap-1 overflow-hidden">
			{#each pills as pill, index (index)}
				<li><Pill label={pill} /></li>
			{/each}
		</ul>
	{/if}
	<Pill variant="icon" icon={arrowRight} {href} label={`Open “${title}”`} />
</div>
