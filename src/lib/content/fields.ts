// Readers for front matter values, shared by the parsers of posts and embeds.

/** A text field, trimmed; undefined when it is missing or empty. */
export function text(value: unknown): string | undefined {
	return value == null || value === '' ? undefined : String(value).trim() || undefined;
}

export function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * A list of texts, without its empty entries. A single text is split at its commas, so that
 * `keywords: a, b` works like a list of two entries.
 */
export function list(value: unknown): string[] {
	const entries = Array.isArray(value) ? value : typeof value === 'string' ? value.split(',') : [];
	return present(entries.map(text));
}

/** A yes/no field: true for `true`, also when written as text ("true"); false otherwise. */
export function flag(value: unknown): boolean {
	return value === true || (typeof value === 'string' && value.trim().toLowerCase() === 'true');
}

/** The values that are set, in order: present(["a", undefined, "b"]) → ["a", "b"]. */
export function present(values: (string | undefined)[]): string[] {
	return values.filter((value): value is string => !!value);
}
