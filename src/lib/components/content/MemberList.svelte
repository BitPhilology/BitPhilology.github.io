<!--
	Member list (Figma "Members" in the Team frames): a column of Team Member cards, one per entry of a
	front matter list. The size of each card follows the member's role (memberSize). Placed in the
	body by the {{team}} and {{advisory-board}} markers (src/lib/embeds.ts).
-->
<script lang="ts">
	import { memberSize } from '$lib/content/team';
	import type { Member } from '$lib/content/types';
	import TeamMember from './TeamMember.svelte';

	let { data }: { data: Member[] } = $props();
</script>

<ul class="flex flex-col gap-4">
	{#each data as member, index (index)}
		<li><TeamMember {member} size={memberSize(member.role)} /></li>
	{/each}
</ul>
