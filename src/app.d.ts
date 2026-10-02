// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { Pathname } from '$app/types';
import type { PostType } from '$lib/categories';

declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		interface PageData {
			/** Set by post pages: the `type` of the post, which decides the active category. */
			postType?: PostType;
			/** Set by the root layout: the path of the credits page inside the site, when there is one. */
			credits?: Pathname;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
