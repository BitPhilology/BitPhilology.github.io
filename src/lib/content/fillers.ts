// Turns a Home image filler file into its data, and fails the build when the file is invalid.
import { soleImage } from './markdown';
import type { FillerAccent, ImageFillerContent } from './types';

const ACCENTS: FillerAccent[] = ['about', 'event', 'publication', 'artifact'];

/**
 * A filler from its file, front matter and body. `resolveImage` turns the image path of the
 * markdown (./assets/…, localised by the import script) into a URL.
 */
export function toFiller(
	file: string,
	data: Record<string, unknown>,
	body: string,
	resolveImage: (src: string) => string
): ImageFillerContent {
	const problems: string[] = [];
	const accent = data.accent as FillerAccent;
	if (!ACCENTS.includes(accent)) {
		problems.push(`accent must be one of ${ACCENTS.join(', ')} (found ${JSON.stringify(data.accent)})`);
	}
	const position = data.position;
	if (typeof position !== 'number' || !Number.isInteger(position)) {
		problems.push(`position must be a whole number (found ${JSON.stringify(position)})`);
	}
	const image = soleImage(body);
	if ('error' in image) problems.push(image.error);

	if (problems.length || 'error' in image) {
		throw new Error(`Invalid Home image filler ${file}: ${problems.join('; ')}.`);
	}
	return { file, accent, position: position as number, image: { src: resolveImage(image.src), alt: image.alt } };
}
