<!--
	Icon plus label: the cell of the category signifier and the dock items.
	The icon is decorative; the label names the cell. `class` lays out the cell (direction, gap, type).
-->
<script lang="ts">
	import type { ClassValue } from 'svelte/elements';
	import Icon from '$lib/components/Icon.svelte';

	interface Props {
		icon: string;
		label: string;
		class?: ClassValue;
		iconClass?: ClassValue;
		labelClass?: ClassValue;
	}

	let { icon, label, class: className, iconClass, labelClass }: Props = $props();
</script>

<span class={['items-center', className]}>
	<Icon svg={icon} class={['shrink-0', iconClass]} />
	<span class={labelClass}>{label}</span>
</span>
