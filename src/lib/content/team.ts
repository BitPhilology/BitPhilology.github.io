// The member list of the Team page: the front matter parser and the Team Member size rule.
import { isRecord, text } from './fields';
import { siteUrl } from './links';
import type { Member } from './types';

/** The Figma "Size" property of Team Member. */
export type MemberSize = 'large' | 'medium';

// The size of a member follows the role. Roles are matched without regard to case; every other
// role is medium.
const SIZE_BY_ROLE: Record<string, MemberSize> = {
	'principal investigator': 'large'
};

export function memberSize(role: string): MemberSize {
	return SIZE_BY_ROLE[role.trim().toLowerCase()] ?? 'medium';
}

interface Context {
	file: string;
	field: string;
	/** Turns the photo path of the front matter (./assets/…) into its built URL. */
	resolveAsset: (src: string) => string;
}

/** A member list from its front matter field. Fails the build when an entry lacks a name or a role. */
export function toMembers(value: unknown, { file, field, resolveAsset }: Context): Member[] {
	if (!Array.isArray(value)) throw new Error(`${file}: "${field}" must be a list of members.`);
	const problems: string[] = [];
	const members = value.map((entry, index): Member => {
		const data = isRecord(entry) ? entry : {};
		const name = text(data.name);
		const role = text(data.role);
		const which = `entry ${index + 1}${name ? ` (${name})` : ''}`;
		if (!name) problems.push(`${which} has no name`);
		if (!role) problems.push(`${which} has no role`);
		const photo = text(data.photo);
		const externalURL = text(data['external-url']);
		return {
			name: name ?? '',
			role: role ?? '',
			affiliation: text(data.affiliation),
			photo: photo && resolveAsset(photo),
			externalURL: externalURL && siteUrl(externalURL)
		};
	});
	if (problems.length) throw new Error(`Invalid "${field}" in ${file}: ${problems.join('; ')}.`);
	return members;
}
