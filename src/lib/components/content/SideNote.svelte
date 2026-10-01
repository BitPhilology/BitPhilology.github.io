<!--
	Side note (the notes of the page frames, "Note 01—…"): a footnote of the body, in pixel/note. Its
	references in the text ("[note 01]") link to its id and are described by it (aria-describedby).
	It inherits the page colour, --cat-darker: Figma draws notes in --cat-main, which is too light
	for 12 px text on three categories (see docs/ARCHITECTURE.md).
-->
<script lang="ts">
	import type { Note } from '$lib/content/types';
	import { TEXT } from '$lib/styles/text';

	let { note }: { note: Note } = $props();
</script>

<!-- Built from the repository's markdown with raw HTML dropped, so it is safe to inject. -->
<p id={note.id} role="note" class={TEXT['pixel/note']}>Note {note.label}—{@html note.html}</p>
