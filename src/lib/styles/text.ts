// Figma text styles (the Typography sheet) as Tailwind classes, under their Figma names.
// Sizes, weights, line heights and tracking are Tailwind's own utilities, as in the tokens.

export const TEXT = {
	'display/page-title': 'text-7xl leading-none font-extralight tracking-tighter',
	'heading/h1': 'text-3xl leading-tight font-bold',
	'heading/h2': 'text-2xl leading-tight font-bold',
	'heading/h3': 'text-xl leading-tight font-semibold',
	'heading/h4': 'text-lg leading-snug font-semibold',
	'heading/h5': 'text-base leading-snug font-semibold',
	'heading/h6': 'text-sm leading-snug font-bold',
	'body/lead-paragraph': 'text-2xl leading-snug font-light',
	'body/body': 'text-base leading-tight font-medium',
	'body/body-lg': 'text-lg leading-tight font-semibold',
	'body/strong': 'text-base leading-tight font-bold',
	'body/blockquote': 'text-xl leading-snug font-light',
	'card/title': 'text-xl leading-none font-extrabold tracking-tight',
	'card/subtitle': 'text-base leading-none font-semibold',
	'card/authors': 'text-base leading-tight font-medium',
	'card/venue': 'text-xs leading-tight font-semibold',
	'code/code': 'font-mono text-sm leading-normal font-medium',
	'pixel/metadata': 'font-pixel text-xs leading-tight',
	// Figma: 12 px with 0.4 px tracking; the nearest tracking utility is tracking-wide (0.3 px).
	'pixel/caption': 'font-pixel text-xs leading-tight tracking-wide',
	// Figma: 11 px with 0.4 px tracking; the nearest utilities are text-xs (12 px) and tracking-wide.
	'pixel/note': 'font-pixel text-xs leading-tight tracking-wide'
} as const;

/**
 * The page title of the page frames: heading/h1 on phones, display/page-title from sm. Written out
 * because Tailwind only sees complete class names; keep it in step with the two styles above.
 */
export const PAGE_TITLE =
	'text-3xl leading-tight font-bold sm:text-7xl sm:leading-none sm:font-extralight sm:tracking-tighter';
