// The details of a post as display text, built from its front matter: the lines of the post
// headers. The pills of the meta row are in src/lib/categories.ts.
import { longDate, writtenDate } from './dates';
import { present } from './fields';
import type { Post } from './types';

/** A labelled line of a header, e.g. { term: 'Location', value: 'University of Bern' }. */
export interface Detail {
	term: string;
	value: string;
}

/** Where an event takes place: the venue, then the location when there is one. */
export function eventPlace(post: Post): string | undefined {
	return present([post.venue, post.location]).join(', ') || undefined;
}

/** The lines under the subtitle of an event (Figma "Events": Location and Date). */
export function eventDetails(post: Post): Detail[] {
	const place = eventPlace(post);
	return [
		...(place ? [{ term: 'Location', value: place }] : []),
		...(post.date ? [{ term: 'Date of the event', value: longDate(post.date) }] : [])
	];
}

/** The venue line of a publication: "Colloque Humanistica 2026, EPITA, Paris — 20 May 2026". */
export function publicationVenue(post: Post): string | undefined {
	const place = present([post.venue, post.location]).join(', ');
	return present([place, post.date && writtenDate(post.date)]).join(' — ') || undefined;
}

/** A DOI as a link: "10.5281/zenodo.1" → "https://doi.org/10.5281/zenodo.1"; a URL stays as it is. */
export function doiUrl(doi: string): string {
	if (/^https?:\/\//i.test(doi)) return doi;
	return `https://doi.org/${doi.replace(/^doi:\s*/i, '')}`;
}
