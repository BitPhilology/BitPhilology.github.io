// The advisory board list of the About page: the front matter parser.
import { isRecord, text } from './fields';
import type { BoardMember } from './types';

interface Context {
	file: string;
	field: string;
}

/** The advisory board from its front matter field. Fails the build when an entry lacks a name. */
export function toBoardMembers(value: unknown, { file, field }: Context): BoardMember[] {
	if (!Array.isArray(value)) throw new Error(`${file}: "${field}" must be a list of board members.`);
	const problems: string[] = [];
	const members = value.map((entry, index): BoardMember => {
		const data = isRecord(entry) ? entry : {};
		const name = text(data.name);
		if (!name) problems.push(`entry ${index + 1} has no name`);
		return { name: name ?? '', affiliation: text(data.affiliation), externalURL: text(data['external-url']) };
	});
	if (problems.length) throw new Error(`Invalid "${field}" in ${file}: ${problems.join('; ')}.`);
	return members;
}
