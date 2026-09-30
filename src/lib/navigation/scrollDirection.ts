// The direction of a scroll, ignoring small jitters. Used by the dock to compact while scrolling down.

const STEP = 8;

/** 'down' or 'up' between two scroll positions, or null when they are less than STEP px apart. */
export function scrollDirection(from: number, to: number): 'down' | 'up' | null {
	if (Math.abs(to - from) < STEP) return null;
	return to > from ? 'down' : 'up';
}
