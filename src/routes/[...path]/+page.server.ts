import { error } from '@sveltejs/kit';
import { getPage, getPosts } from '$lib/server/content';
import type { EntryGenerator, PageServerLoad } from './$types';

// One page per post, at the path of its folder in src/content. Image fillers have no page.
export const entries: EntryGenerator = () => getPosts().map(({ path }) => ({ path }));

export const load: PageServerLoad = ({ params }) => {
	const page = getPage(params.path);
	if (!page) error(404, 'Not found');
	return { page, postType: page.post.type };
};
