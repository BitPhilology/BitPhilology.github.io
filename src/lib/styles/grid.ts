// The grid of the post pages (Figma "Body (grid)" of the About, Events, Artifacts, Publications
// and Team frames), as Tailwind classes. PageShell lays out the page with them, and each block of
// the body is one row (BodyBlocks). 16 px gaps; the layout changes only at sm, lg and xl.
//
//              columns   meta row   index   header, block content   notes, caption
//   base, sm   1         in order   –       in order                after the content
//   lg         3         1–3        –       1–2                     3
//   xl         4         1–4        1       2–3                     4
//
// From lg the article is a subgrid of the page grid, and every block row a subgrid of the article,
// so a note or a caption sits on the row of the paragraph or image it belongs to.
export const GRID = {
	page: 'grid grid-cols-1 gap-4 lg:grid-cols-3 xl:grid-cols-4',
	meta: 'lg:col-span-3 xl:col-span-4',
	// The page index exists only at xl; it stays in view while the article scrolls.
	index: 'max-xl:hidden xl:sticky xl:top-8 xl:col-start-1 xl:row-start-2 xl:self-start',
	article: 'grid grid-cols-1 gap-4 lg:col-span-3 lg:grid-cols-subgrid xl:col-start-2 xl:row-start-2',
	header: 'lg:col-span-2',
	row: 'flex flex-col gap-4 lg:col-span-3 lg:grid lg:grid-cols-subgrid',
	content: 'min-w-0 lg:col-span-2',
	// The notes column keeps a 64 px margin on its right, as in the Figma frames.
	aside: 'lg:col-start-3 lg:pr-16'
} as const;
