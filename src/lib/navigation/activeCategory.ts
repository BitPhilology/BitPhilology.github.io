// The active category of the current page: one derived value for the dock, the top stroke and
// the page theme. Call it inside a component ($derived) so that it follows navigation.
import { dev } from '$app/environment';
import { page } from '$app/state';
import { categoryForPath, categoryOf, type Category } from '$lib/categories';

/**
 * On a post page, the category of the post's `type` (from its load data, team → about); on list
 * pages and Home, the category of the URL. The two must agree: in development a mismatch is logged.
 *
 * The URL is read as the route, with the rest parameter of post pages filled in, and not as
 * page.url.pathname, which also holds the base path the site is deployed under.
 */
export function activeCategory(): Category {
	const fromUrl = categoryForPath(page.params.path ? `/${page.params.path.replace(/\/+$/, '')}` : (page.route.id ?? '/'));
	const { postType } = page.data;
	if (!postType) return fromUrl;
	const fromPost = categoryOf(postType);
	if (dev && fromPost !== fromUrl) {
		console.warn(`${page.url.pathname}: the front matter says "${fromPost}", the URL says "${fromUrl}".`);
	}
	return fromPost;
}
