<!--
	Navigation dock (Figma "Navigation Dock"): the bottom navigation of every page, fixed to the
	viewport. It renders one NavDockItem per dock entry of the registry. Styles, by breakpoint only:
	phone (icon over label) below lg, compact (icons only, lower) while scrolling down below lg, and
	wide (icon beside label) from lg. It owns the open page sheet: one at a time, closed by Escape,
	a click outside or a navigation.
-->
<script lang="ts">
	import type { Attachment } from 'svelte/attachments';
	import { afterNavigate } from '$app/navigation';
	import { DOCK, type Category } from '$lib/categories';
	import type { PostLink } from '$lib/content/types';
	import { scrollDirection } from '$lib/navigation/scrollDirection';
	import NavDockItem from './NavDockItem.svelte';

	interface Props {
		/** The posts of each category, for the page sheets. */
		sheets: Partial<Record<Category, PostLink[]>>;
		active: Category;
	}

	let { sheets, active }: Props = $props();

	let open = $state<Category | null>(null);
	let compact = $state(false);
	// The button that opened the sheet, to give it the focus back; the last scroll position.
	let trigger: HTMLElement | undefined;
	let lastY = 0;

	function toggle(category: Category, button: HTMLElement) {
		trigger = button;
		open = open === category ? null : category;
		compact = false;
	}

	function close({ restoreFocus = true } = {}) {
		open = null;
		if (restoreFocus) trigger?.focus();
	}

	function onscroll() {
		const direction = scrollDirection(lastY, window.scrollY);
		if (!direction) return;
		compact = direction === 'down' && open === null;
		lastY = window.scrollY;
	}

	const closeOnClickOutside: Attachment<HTMLElement> = (nav) => {
		const onpointerdown = (event: PointerEvent) => {
			if (open && !nav.contains(event.target as Node)) close({ restoreFocus: false });
		};
		window.addEventListener('pointerdown', onpointerdown);
		return () => window.removeEventListener('pointerdown', onpointerdown);
	};

	afterNavigate(() => (open = null));
</script>

<svelte:window
	{onscroll}
	onkeydown={(event) => {
		if (event.key === 'Escape' && open) close();
	}}
/>

<nav
	{@attach closeOnClickOutside}
	aria-label="Main"
	data-compact={compact || undefined}
	class="group/dock fixed inset-x-0 bottom-0 z-40 border-t-2 border-surface-dark-background bg-surface-white"
>
	<ul class="flex">
		{#each DOCK as entry (entry.category)}
			<NavDockItem
				{entry}
				active={entry.category === active}
				open={open === entry.category}
				posts={sheets[entry.category] ?? []}
				ontoggle={(button) => toggle(entry.category, button)}
				onclose={() => close()}
			/>
		{/each}
	</ul>
</nav>
