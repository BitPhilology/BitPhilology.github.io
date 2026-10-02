// Figma text styles (the Typography sheet) as Tailwind classes, under their Figma names.
// Sizes, weights, line heights and tracking are Tailwind's own utilities: where Figma has a value
// between two utilities, the nearest one is used, and the comment gives the Figma value. The custom
// axes of the pixel font are the exception: they are exact, in src/lib/styles/tokens.css.

export const TEXT = {
	// Figma: line height 0.85 and -2 px tracking; the nearest are leading-none (1) and tracking-tight (-1.8 px).
	'display/page-title': 'text-7xl leading-none font-extralight tracking-tight',
	'heading/h1': 'text-3xl leading-tight font-bold',
	'heading/h2': 'text-2xl leading-tight font-bold',
	'heading/h3': 'text-xl leading-tight font-semibold',
	'heading/h4': 'text-lg leading-snug font-semibold',
	'heading/h5': 'text-base leading-snug font-semibold',
	'heading/h6': 'text-sm leading-snug font-bold',
	// Figma's body styles have line height 1.2; the nearest is leading-tight (1.25).
	// Figma: -0.5 px tracking; the nearest is tracking-tight (-0.6 px).
	'body/lead-paragraph': 'text-2xl leading-tight font-light tracking-tight',
	'body/body': 'text-base leading-tight font-medium',
	'body/body-lg': 'text-lg leading-tight font-semibold',
	'body/strong': 'text-base leading-tight font-bold',
	'body/blockquote': 'text-xl leading-snug font-light',
	// Figma: line height 0.9 and -0.4 px tracking; the nearest are leading-none (1) and tracking-tight (-0.45 px).
	'card/title': 'text-lg leading-none font-bold tracking-tight',
	'card/subtitle': 'text-sm leading-none font-medium',
	'card/authors': 'text-sm leading-tight font-medium',
	'card/venue': 'text-xs leading-tight font-semibold',
	'code/code': 'font-mono text-sm leading-normal font-medium',
	'pixel/metadata': 'font-pixel text-xs leading-tight',
	// Figma: 1 px tracking; the nearest is tracking-widest (1.2 px).
	'pixel/caption': 'font-pixel-caption text-xs leading-none tracking-widest',
	// Figma: 11 px with 0.4 px tracking; the nearest are text-xs (12 px) and tracking-wide (0.3 px).
	'pixel/note': 'font-pixel-note text-xs leading-tight tracking-wide'
} as const;

/**
 * The page title of the page frames: heading/h1 on phones, display/page-title from sm. Written out
 * because Tailwind only sees complete class names; keep it in step with the two styles above.
 */
export const PAGE_TITLE =
	'text-3xl leading-tight font-bold sm:text-7xl sm:leading-none sm:font-extralight sm:tracking-tight';
