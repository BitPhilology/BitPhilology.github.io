// The rule that composes the Home grid. Change the order of the Home tiles here, and only here.
//
// The tiles are the posts (except those with `hidden-from-home: true`, which keep their page and
// their place in the dock's page sheet) and the image fillers. A `position` in the front matter is
// the place of a tile in the final grid: 1 is the first tile, 2 the second…; -1 is the last tile,
// -2 the one before it… A post without a position follows its date.
//
//   1. the image fillers take their position (position 1 is the logo filler);
//   2. the posts with a positive position take it, or the next free place after it;
//   3. the posts with a negative position take it, or the nearest free place before it, so
//      several posts with -1 all end up at the bottom;
//   4. a position past the end of the grid means the last free place;
//   5. the posts without a position fill the places left, newest first.
//
// Posts that share a position keep their date order, newest first. The footer tiles (colophon,
// partner logos) follow the grid: <Footer> renders them inside the same grid.
import { byDate } from '$lib/content/posts';
import type { ImageFillerContent, Post } from '$lib/content/types';

export type HomeTile = { kind: 'post'; post: Post } | { kind: 'filler'; filler: ImageFillerContent };

type Slots = (HomeTile | undefined)[];

/** A stable key for each tile, for keyed lists. */
export function tileKey(tile: HomeTile): string {
	return tile.kind === 'post' ? tile.post.path : tile.filler.file;
}

export function composeHomeTiles(posts: Post[], fillers: ImageFillerContent[]): HomeTile[] {
	checkPositions(fillers);
	const shown = posts.filter((post) => !post.hiddenFromHome).sort(byDate);
	const size = shown.length + fillers.length;
	const slots: Slots = new Array<HomeTile | undefined>(size).fill(undefined);
	const post = (item: Post): HomeTile => ({ kind: 'post', post: item });
	const positionOf = (tile: HomeTile) => (tile.kind === 'post' ? tile.post.position : tile.filler.position) ?? 0;

	const fixed = fillers.map((filler): HomeTile => ({ kind: 'filler', filler }));
	const fromStart = shown.filter(({ position = 0 }) => position > 0).map(post);
	const fromEnd = shown.filter(({ position = 0 }) => position < 0).map(post);
	const byPosition = (a: HomeTile, b: HomeTile) => positionOf(a) - positionOf(b);
	const inGrid = (tile: HomeTile) => positionOf(tile) <= size;

	// The sorts are stable, so tiles with the same position keep the date order of `shown`.
	for (const tile of [...fixed.filter(inGrid), ...fromStart.filter(inGrid).sort(byPosition)]) {
		place(slots, tile, positionOf(tile) - 1, 1);
	}
	// From the last tile backwards: the oldest post of a position first, so the newest reads first.
	for (const tile of fromEnd.reverse().sort((a, b) => byPosition(b, a))) {
		place(slots, tile, size + positionOf(tile), -1);
	}
	// Past the end of the grid: the highest position takes the last free place.
	const pastEnd = [...fixed, ...fromStart].filter((tile) => !inGrid(tile));
	for (const tile of pastEnd.reverse().sort((a, b) => byPosition(b, a))) place(slots, tile, size - 1, -1);
	// The rest, newest first, in the places left.
	for (const item of shown.filter(({ position }) => position === undefined)) place(slots, post(item), 0, 1);

	return slots.filter((tile) => tile !== undefined);
}

/**
 * Puts a tile in the free slot nearest to `wanted`, looking in `direction` first (1: towards the
 * end of the grid, -1: towards its start) and then the other way.
 */
function place(slots: Slots, tile: HomeTile, wanted: number, direction: 1 | -1) {
	const start = Math.min(Math.max(wanted, 0), slots.length - 1);
	for (const step of [direction, -direction]) {
		for (let index = start; index >= 0 && index < slots.length; index += step) {
			if (!slots[index]) {
				slots[index] = tile;
				return;
			}
		}
	}
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
