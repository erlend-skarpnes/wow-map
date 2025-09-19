<script lang="ts">
	import { P, Avatar, Card } from 'flowbite-svelte';
	import type { AccountData, CharacterData } from '$lib/server';
	import { capitalizeFirst, formatDuration } from '$lib';
	import PlayerIcon from '$lib/components/PlayerIcon.svelte';

	let { character, accountName }: { character: CharacterData, accountName?: string} = $props();

	const unixTimestampNow = Date.now() / 1000;

</script>

<Card class={"my-1 p-2 px-4 hover:bg-gray-400"}>
	<div class="flex-row flex gap-6 w-full">
		<div class="flex items-center">
			<PlayerIcon character={character} />
		</div>
		<div>
			<P class="font-medium">{character?.name}<span class="font-extralight text-sm m-2">Lvl {character?.level}</span></P>
			{#if accountName}
				<P class="font-extralight">{capitalizeFirst(accountName)}, <span class="text-sm m-2">{character.online ? "Online" : `Last online ${formatDuration(unixTimestampNow - character.lastOnline, 1)} ago`}</span></P>
			{:else}
				<P class="font-extralight text-sm">{character.online ? "Online" : `Last online ${formatDuration(unixTimestampNow - character.lastOnline, 1)} ago`}</P>
			{/if}
		</div>
	</div>
</Card>