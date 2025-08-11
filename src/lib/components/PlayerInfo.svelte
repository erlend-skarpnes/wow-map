<script lang="ts">
	import type { AccountData, CharacterData } from '$lib';
	import { Card, Avatar, AccordionItem } from 'flowbite-svelte';

	let { players }: { players: AccountData[] } = $props<{ players: AccountData[] }>();
	const onlinePlayers = players.filter(p => p.online);
	const offlinePlayers = players.filter(p => !p.online && !p.account.startsWith('RNDBOT'));

	const getPortrait = (character: CharacterData | null): string | undefined => {
		if (character == null) return undefined;
		return `/races/${character.race.replace(' ', '').toLowerCase()}-${character.gender.toLowerCase()}.jpg`;
	};

	const getClassPicture = (character: CharacterData | null): string | undefined => {
		if (character == null) return undefined;
		return `/classes/${character.class.toLowerCase()}.jpg`;
	};

</script>

<Card class="p-4 sm:p-6 md:p-8 overflow-scroll">

	<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Players</h5>
	{#if onlinePlayers.length === 0}
		No players online
	{:else}
		{#each onlinePlayers as player}
			<div class="py-2 px-4 my-1 bg-gray-300 rounded-2xl  flex-row flex gap-2 w-full justify-between">
				<div>
					<p class="font-medium">{player.account}</p>
					<p class="font-extralight">{player.character?.name}, {player.character?.level}</p>
				</div>
				<div class="flex flex-row gap-1 justify-end items-center">
					<Avatar src={getPortrait(player.character)} />
					<Avatar src={getClassPicture(player.character)} />
				</div>
			</div>
		{/each}
	{/if}

	<div class="mt-4">
		<h6 class="text-gray-400 text-lg">Offline</h6>
		{#each offlinePlayers as player}
			<div class="text-gray-400 text-sm pt-1"><span class="font-medium">{player.account}</span>
			</div>
		{/each}
	</div>
</Card>