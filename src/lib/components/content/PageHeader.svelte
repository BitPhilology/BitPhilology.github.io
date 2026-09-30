<!--
	Page header (Figma "Page Header"): the page's only h1 and its lead paragraph, the first paragraph
	of the body (rendered to HTML at build time). The title is heading/h1 on phones and
	display/page-title from sm.
-->
<script lang="ts">
	import { PAGE_TITLE, TEXT } from '$lib/styles/text';

	interface Props {
		title: string;
		subtitle?: string;
		/** The HTML inside the lead paragraph. */
		lead?: string;
	}

	let { title, subtitle, lead }: Props = $props();
</script>

<header class="flex flex-col gap-4">
	<h1 class={PAGE_TITLE}>{title}</h1>
	{#if subtitle}<p class={TEXT['card/subtitle']}>{subtitle}</p>{/if}
	<!-- Built from the repository's markdown with raw HTML dropped, so it is safe to inject. -->
	{#if lead}<p class={TEXT['body/lead-paragraph']}>{@html lead}</p>{/if}
</header>
