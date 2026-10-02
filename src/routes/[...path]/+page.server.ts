import { error } from '@sveltejs/kit';
import { getPage, getPosts } from '$lib/server/content';
import type { EntryGenerator, PageServerLoad } from './$types';

// One page per post, at the path of its folder in src/content. Image fillers have no page.
export const entries: EntryGenerator = () => getPosts().map(({ path }) => ({ path }));

export const load: PageServerLoad = ({ params }) => {
	// With trailingSlash: 'always' the rest parameter keeps the slash at the end of the URL.
	const page = getPage(params.path.replace(/\/+$/, ''));
	if (!page) error(404, 'Not found');
	return { page, postType: page.post.type };
};
