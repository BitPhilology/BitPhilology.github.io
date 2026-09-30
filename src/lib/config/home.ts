// The rule that composes the Home grid. Change the order of the Home tiles here, and only here.
//
//   1. the posts: pinned first, then newest first;
//   2. the image fillers, inserted at their `position`: the 1-based index in the final grid.
//      Position 1 is the first tile (the logo filler). A position past the last post puts the
//      filler at the end;
//   3. the footer tiles (colophon, partner logos), rendered by <Footer> inside the same grid.
import { pinnedThenByDate } from '$lib/content/posts';
import type { ImageFillerContent, Post } from '$lib/content/types';

export type HomeTile = { kind: 'post'; post: Post } | { kind: 'filler'; filler: ImageFillerContent };

/** A stable key for each tile, for keyed lists. */
export function tileKey(tile: HomeTile): string {
	return tile.kind === 'post' ? tile.post.path : tile.filler.file;
}

export function composeHomeTiles(posts: Post[], fillers: ImageFillerContent[]): HomeTile[] {
	checkPositions(fillers);
	const tiles = [...posts].sort(pinnedThenByDate).map((post): HomeTile => ({ kind: 'post', post }));
	for (const filler of [...fillers].sort((a, b) => a.position - b.position)) {
		tiles.splice(Math.min(filler.position - 1, tiles.length), 0, { kind: 'filler', filler });
	}
	return tiles;
}

/** Fails the build when a filler's position is below 1 or already taken by another filler. */
function checkPositions(fillers: ImageFillerContent[]) {
	const problems: string[] = [];
	const taken = new Map<number, string>();
	for (const { file, position } of fillers) {
		if (position < 1) {
			problems.push(`${file}: position ${position} is not in the grid; positions start at 1`);
		} else if (taken.has(position)) {
			problems.push(`${file}: position ${position} is already taken by ${taken.get(position)}`);
		} else {
			taken.set(position, file);
		}
	}
	if (problems.length) throw new Error(`Invalid Home image fillers:\n  ${problems.join('\n  ')}`);
}
