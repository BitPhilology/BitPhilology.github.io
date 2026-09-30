// Embed markers in markdown bodies: {{name}}, with optional spaces inside the braces. A marker must
// be a paragraph of its own; src/lib/server/markdown.ts replaces it with the embed it names.

const MARKER = /\{\{\s*([^{}]*?)\s*\}\}/g;

/** The name of the marker that makes up the whole text, or null. "{{ team }}" → "team". */
export function markerName(text: string): string | null {
	const match = text.trim().match(/^\{\{\s*([^{}]*?)\s*\}\}$/);
	return match ? match[1] : null;
}

/** Every marker in a text, as written: "Text {{x}} here" → ["{{x}}"]. */
export function findMarkers(text: string): string[] {
	return [...text.matchAll(MARKER)].map(([marker]) => marker);
}
