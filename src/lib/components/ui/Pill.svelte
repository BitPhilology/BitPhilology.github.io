<!--
	Pill (Figma "Pill"): a small outlined label in the current category colour, used in the meta row
	of posts. `variant` mirrors the Figma "Type" property. With `href` it is a link: the arrow button
	of a post card is an icon pill.
-->
<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import { TEXT } from '$lib/styles/text';

	type Variant = 'text' | 'icon-text' | 'icon';

	interface Props {
		variant?: Variant;
		/** The text; for the icon variant, the accessible name. */
		label: string;
		icon?: string;
		href?: string;
	}

	let { variant = 'text', label, icon, href }: Props = $props();

	const VARIANTS: Record<Variant, string> = {
		text: 'h-6 px-2',
		'icon-text': 'gap-1 px-2 py-1',
		icon: ''
	};
</script>

<svelte:element
	this={href ? 'a' : 'span'}
	{href}
	aria-label={variant === 'icon' ? label : undefined}
	class={[
		'inline-flex shrink-0 items-center justify-center border border-(--cat-darker) bg-surface-white whitespace-nowrap text-(--cat-darker)',
		TEXT['pixel/metadata'],
		VARIANTS[variant]
	]}
>
	{#if icon && variant !== 'text'}<Icon svg={icon} />{/if}
	{#if variant !== 'icon'}{label}{/if}
</svelte:element>
