// Readers for front matter values, shared by the parsers of posts and embeds.

/** A text field, trimmed; undefined when it is missing or empty. */
export function text(value: unknown): string | undefined {
	return value == null || value === '' ? undefined : String(value).trim() || undefined;
}

export function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** The values that are set, in order: present(["a", undefined, "b"]) → ["a", "b"]. */
export function present(values: (string | undefined)[]): string[] {
	return values.filter((value): value is string => !!value);
}
