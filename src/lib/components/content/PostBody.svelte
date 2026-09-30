<!--
	Stacked post body (Figma "Post" › Body): the title over a description line. The default body of
	PostCard; the registry says which description a post type shows.
-->
<script lang="ts">
	import { POST_TYPES } from '$lib/categories';
	import type { Post } from '$lib/content/types';
	import { TEXT } from '$lib/styles/text';

	let { post }: { post: Post } = $props();

	const description = $derived(POST_TYPES[post.type].card.description(post));
	const DESCRIPTION_STYLES = { subtitle: TEXT['card/subtitle'], body: TEXT['body/body'] };
</script>

<div class="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden px-8 text-(--cat-darker)">
	<h2 class={TEXT['card/title']}>{post.title}</h2>
	{#if description}
		<p class={DESCRIPTION_STYLES[description.style]}>{description.text}</p>
	{/if}
</div>
