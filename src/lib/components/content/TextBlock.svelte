<!--
	Text block: a paragraph, heading, list… of a post body (one "Content" frame of the page frames)
	as one row of the page grid, with the notes it refers to in the notes column, on the same row.
	Below lg the notes follow the text.
-->
<script lang="ts">
	import type { Note } from '$lib/content/types';
	import { GRID } from '$lib/styles/grid';
	import SideNote from './SideNote.svelte';

	let { html, notes }: { html: string; notes: Note[] } = $props();
</script>

<div class={GRID.row}>
	<!-- Built from the repository's markdown with raw HTML dropped, so it is safe to inject. -->
	<div class={GRID.content}>{@html html}</div>
	{#if notes.length}
		<div class={[GRID.aside, 'flex flex-col gap-4']}>
			{#each notes as note (note.id)}
				<SideNote {note} />
			{/each}
		</div>
	{/if}
</div>
