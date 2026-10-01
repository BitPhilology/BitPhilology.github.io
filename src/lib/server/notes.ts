// Sidenotes: the footnotes of a markdown body. The editor writes [^label] in the text and the note
// as a paragraph of its own, [^label]: …, anywhere in the body. Notes are numbered in the order of
// their first reference, and each one is paired with the top-level block (paragraph, list,
// heading…) that first refers to it: the page shows the note on that block's row. Every reference
// becomes a link to its note, "[note 01]", which screen readers describe with the note's text.
import type { FootnoteDefinition, FootnoteReference, Link, Nodes, Root, RootContent } from 'mdast';

/** A note before rendering: its id and number, and the markdown of its text. */
export interface NoteSource {
	/** The id of the note element: "sidenote-01". */
	id: string;
	/** "01". */
	label: string;
	definition: FootnoteDefinition;
}

/**
 * Takes the note definitions out of the tree, replaces each reference with a link to its note and
 * returns the notes of each top-level block, in order. A definition that nothing refers to is
 * dropped, with a warning.
 */
export function pairNotes(root: Root, file: string): Map<RootContent, NoteSource[]> {
	const definitions = takeDefinitions(root);
	const notes = new Map<string, NoteSource>();
	const references = new Map<string, number>();
	const byBlock = new Map<RootContent, NoteSource[]>();

	for (const block of root.children) {
		replaceReferences(block, (reference) => {
			const definition = definitions.get(reference.identifier);
			if (!definition) return undefined;
			let note = notes.get(reference.identifier);
			if (!note) {
				const label = String(notes.size + 1).padStart(2, '0');
				note = { id: `sidenote-${label}`, label, definition };
				notes.set(reference.identifier, note);
				byBlock.set(block, [...(byBlock.get(block) ?? []), note]);
			}
			// A note referred to more than once gets one note and one link per reference.
			const count = (references.get(note.id) ?? 0) + 1;
			references.set(note.id, count);
			return referenceLink(note, count);
		});
	}

	for (const [identifier, definition] of definitions) {
		if (!notes.has(identifier)) {
			console.warn(`${file}: the note [^${definition.label ?? identifier}] is never referred to in the text, so it is not shown.`);
		}
	}
	return byBlock;
}

/** "[note 01]", linking to the note and described by it. */
function referenceLink(note: NoteSource, count: number): Link {
	const id = count === 1 ? `${note.id}-ref` : `${note.id}-ref-${count}`;
	return {
		type: 'link',
		url: `#${note.id}`,
		children: [{ type: 'text', value: `[note ${note.label}]` }],
		data: { hProperties: { id, ariaDescribedBy: [note.id] } }
	};
}

/** Removes the note definitions from the tree, wherever they are, and returns them by identifier. */
function takeDefinitions(root: Root): Map<string, FootnoteDefinition> {
	const definitions = new Map<string, FootnoteDefinition>();
	const take = (node: Nodes) => {
		if (!('children' in node)) return;
		const children = node.children as Nodes[];
		for (const child of children) {
			if (child.type === 'footnoteDefinition') definitions.set(child.identifier, child);
			else take(child);
		}
		node.children = children.filter((child) => child.type !== 'footnoteDefinition') as typeof node.children;
	};
	take(root);
	return definitions;
}

/** Replaces the note references inside a node, in reading order; `replace` may keep a reference. */
function replaceReferences(node: Nodes, replace: (reference: FootnoteReference) => Link | undefined) {
	if (!('children' in node)) return;
	node.children = (node.children as Nodes[]).map((child) => {
		if (child.type === 'footnoteReference') return replace(child) ?? child;
		replaceReferences(child, replace);
		return child;
	}) as typeof node.children;
}
