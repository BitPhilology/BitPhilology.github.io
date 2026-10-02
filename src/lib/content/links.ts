// URLs written in the content: the links and images of a body, `download-link`, `external-url`.
// A path of the site, which starts with "/", gets the base path the site is deployed under
// (kit.paths.base, from BASE_PATH). Everything else stays as it is: a full URL, an anchor, a
// relative path, mailto:…
import { resolve } from '$app/paths';
import type { Pathname } from '$app/types';

export function siteUrl(url: string): string {
	return /^\/(?!\/)/.test(url) ? resolve(url as Pathname) : url;
}
