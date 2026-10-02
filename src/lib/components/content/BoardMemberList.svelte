<!--
	Board member list: the advisory board of the About page, as a bulleted list styled like the
	lists of the body. One item per entry of the `advisory-board` front matter list: the name, the
	affiliation in brackets, and an icon that links to the member's page. An entry without
	affiliation or external-url is shown without the brackets or the icon. Placed in the body by the
	{{advisory-board}} marker (src/lib/embeds.ts).
-->
<script lang="ts">
	import externalLink from 'pixelarticons/svg/external-link.svg?raw';
	import Icon from '$lib/components/Icon.svelte';
	import type { BoardMember } from '$lib/content/types';
	import { MARKDOWN_CLASSES } from '$lib/styles/markdown';

	let { data }: { data: BoardMember[] } = $props();
</script>

<ul class={MARKDOWN_CLASSES.ul}>
	{#each data as member, index (index)}
		<!-- A line is as tall as the icon (24 px), so the items with and without a link are spaced alike. -->
		<li class="leading-6">
			{member.name}
			{#if member.affiliation}({member.affiliation}){/if}
			{#if member.externalURL}
				<a href={member.externalURL} class="inline-block align-top">
					<Icon svg={externalLink} label="Web page of {member.name} (external link)" />
				</a>
			{/if}
		</li>
	{/each}
</ul>
