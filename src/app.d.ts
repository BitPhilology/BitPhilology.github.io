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
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
