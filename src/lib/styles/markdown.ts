// The classes of the elements of a rendered markdown body, by tag name, added at build time by
// src/lib/server/markdown.ts. They are the Figma text styles of TEXT; the colour comes from the
// page (--cat-darker). The vertical rhythm between blocks is MarkdownBody's gap.
import { TEXT } from './text';

export const MARKDOWN_CLASSES: Partial<Record<string, string>> = {
	h2: `${TEXT['heading/h2']} scroll-mt-4`,
	h3: `${TEXT['heading/h3']} scroll-mt-4`,
	h4: TEXT['heading/h4'],
	h5: TEXT['heading/h5'],
	h6: TEXT['heading/h6'],
	p: TEXT['body/body'],
	ul: `${TEXT['body/body']} list-disc pl-6`,
	ol: `${TEXT['body/body']} list-decimal pl-6`,
	blockquote: `${TEXT['body/blockquote']} border-l-2 border-(--cat-main) pl-4`,
	pre: 'overflow-x-auto bg-surface-subtle p-4',
	code: TEXT['code/code'],
	a: 'underline underline-offset-2',
	strong: 'font-bold',
	del: 'line-through',
	hr: 'border-(--cat-darker)',
	img: 'max-w-full'
};
