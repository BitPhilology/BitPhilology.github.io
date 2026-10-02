// The embeds of markdown bodies: a marker such as {{team}}, on a line of its own in the body, renders
// a component with the data of a front matter field, where the marker stands. Editors move the
// marker to move the embed. To add an embed, add one entry here; see docs/ARCHITECTURE.md.
import type { Component } from 'svelte';
import BoardMemberList from '$lib/components/content/BoardMemberList.svelte';
import MemberList from '$lib/components/content/MemberList.svelte';
import { toBoardMembers } from '$lib/content/board';
import { toMembers } from '$lib/content/team';

export interface EmbedContext {
	/** The markdown file, for error messages. */
	file: string;
	/** The front matter field. */
	field: string;
	/** Turns a path of the front matter (./assets/…) into its built URL. */
	resolveAsset: (src: string) => string;
}

interface Embed<T> {
	/** The front matter field that holds the data. */
	field: string;
	/** Reads and validates the field; throws an error that names the file. Runs at build time. */
	parse: (value: unknown, context: EmbedContext) => T;
	/** Renders the data, which it receives as `data`. */
	component: Component<{ data: T }>;
}

const embed = <T>(entry: Embed<T>) => entry;

export const EMBEDS = {
	team: embed({ field: 'members', parse: toMembers, component: MemberList }),
	'advisory-board': embed({ field: 'advisory_board', parse: toBoardMembers, component: BoardMemberList })
};

export type EmbedName = keyof typeof EMBEDS;

export function isEmbedName(name: string): name is EmbedName {
	return Object.hasOwn(EMBEDS, name);
}

/** The component of an embed and its props, for BodyBlocks. */
export function embedView(name: string, data: unknown) {
	if (!isEmbedName(name)) throw new Error(`Unknown embed "${name}".`);
	return { component: EMBEDS[name].component as Component<{ data: unknown }>, props: { data } };
}
