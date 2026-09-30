<!--
	Two-column post body (Figma "Post", Category=publication › Body): the title on the left, the
	authors and venue on the right, aligned to the bottom. Long titles use the smaller heading/h6
	style, as the Figma Home frames do.
-->
<script lang="ts">
	import { LONG_TITLE } from '$lib/content/posts';
	import type { Post } from '$lib/content/types';
	import { TEXT } from '$lib/styles/text';

	let { post }: { post: Post } = $props();
</script>

<div class="flex min-h-0 flex-1 gap-3 overflow-hidden px-8 text-(--cat-darker)">
	<h2 class={['min-w-0 flex-1', post.title.length > LONG_TITLE ? TEXT['heading/h6'] : TEXT['card/title']]}>
		{post.title}
	</h2>
	<div class="flex min-w-0 flex-1 flex-col justify-end gap-2">
		{#if post.authors}<p class={TEXT['card/authors']}>{post.authors}</p>{/if}
		{#if post.venue}<p class={TEXT['card/venue']}>{post.venue}</p>{/if}
	</div>
</div>
