<!--
	Container: the centred page width of the four Figma frames (base, sm, lg, xl) with the 16 px page
	padding. Between two breakpoints it keeps the width of the smaller one, so the layout never
	stretches; Tailwind's `container` would also stop at md and 2xl, which the design does not use.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLElement> {
		element?: 'main' | 'article' | 'div';
		children: Snippet;
	}

	let { element = 'div', class: className, children, ...rest }: Props = $props();
</script>

<svelte:element
	this={element}
	class={[
		'mx-auto w-full px-4 sm:max-w-(--breakpoint-sm) lg:max-w-(--breakpoint-lg) xl:max-w-(--breakpoint-xl)',
		className
	]}
	{...rest}
>
	{@render children()}
</svelte:element>
