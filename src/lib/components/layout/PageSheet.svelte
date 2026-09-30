<!--
	Page sheet (Figma "Page Sheet"): the posts of a category, stacked above the dock when its item is
	tapped. Full width on phones, a popover above the item from lg. A non-modal dialog: it takes the
	focus when it opens; the close button, Escape, a click outside or a navigation close it (NavDock).
	Ready for pagination: it lists the `posts` it is given.
-->
<script lang="ts">
	import arrowRight from 'pixelarticons/svg/arrow-right.svg?raw';
	import closeIcon from 'pixelarticons/svg/close.svg?raw';
	import type { Attachment } from 'svelte/attachments';
	import type { DOCK } from '$lib/categories';
	import Icon from '$lib/components/Icon.svelte';
	import IconLabel from '$lib/components/ui/IconLabel.svelte';
	import type { PostLink } from '$lib/content/types';
	import { TEXT } from '$lib/styles/text';

	interface Props {
		id: string;
		entry: (typeof DOCK)[number];
		posts: PostLink[];
		onclose: () => void;
	}

	let { id, entry, posts, onclose }: Props = $props();

	// Take the focus when the sheet opens, without scrolling: it is already in view above the dock.
	const focusOnOpen: Attachment<HTMLElement> = (sheet) => sheet.focus({ preventScroll: true });
</script>

<div
	{@attach focusOnOpen}
	{id}
	role="dialog"
	aria-label={entry.dockLabel}
	tabindex="-1"
	class="z-10 border border-(--cat-darker) bg-surface-white max-lg:fixed max-lg:inset-x-0 max-lg:bottom-16 lg:absolute lg:inset-x-0 lg:bottom-full lg:mb-0.5"
>
	<div class="flex items-center gap-2 bg-(--cat-lighter) py-2.5 pr-2 pl-4 text-(--cat-darker)">
		<IconLabel
			icon={entry.icon}
			label={entry.dockLabel}
			class="flex flex-1 gap-2"
			labelClass={[TEXT['pixel/metadata'], 'uppercase']}
		/>
		<button type="button" aria-label="Close" onclick={onclose}>
			<Icon svg={closeIcon} />
		</button>
	</div>
	<ul class="max-h-96 overflow-y-auto">
		{#each posts as post (post.href)}
			<li class="border-t border-(--cat-darker)">
				<a
					href={post.href}
					class={['flex min-h-13 items-center gap-3 px-4 py-3 text-(--cat-darker)', TEXT['body/strong']]}
				>
					<span class="flex-1">{post.title}</span>
					<Icon svg={arrowRight} class="shrink-0" />
				</a>
			</li>
		{:else}
			<li class={['border-t border-(--cat-darker) px-4 py-3 text-(--cat-darker)', TEXT['body/body']]}>
				No posts yet.
			</li>
		{/each}
	</ul>
</div>
