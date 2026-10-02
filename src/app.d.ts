// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { PostType } from '$lib/categories';

declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		interface PageData {
			/** Set by post pages: the `type` of the post, which decides the active category. */
			postType?: PostType;
			/** Set by the root layout: the URL of the credits page, when there is one. */
			credits?: string;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
