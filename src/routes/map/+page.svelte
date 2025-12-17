<script lang="ts">
	import Map from '$lib/components/Map.svelte';
	import type { AccountData, AccountOverviewData, CharacterDataWithCoordinates } from '$lib/server';
	import { Checkbox, Heading, P } from 'flowbite-svelte';
	import PlayerCard from '$lib/components/PlayerCard.svelte';
	import DeckGLMap from '$lib/components/DeckGLMap.svelte';

	let { data }: { data: { players: AccountOverviewData<CharacterDataWithCoordinates>[] } } = $props();

	let showOffline = $state(false);
	let activePlayerName: string | null = $state(null);


	let players = $derived.by(() => {

			let allPlayers = data.players.flatMap(player => player.characters).filter(player => player.level > 1) as CharacterDataWithCoordinates[];

			if (showOffline === false) {
				return allPlayers.filter(player => player.online === true);
			}
			return allPlayers.sort((a, b) => {
				if (a.online === b.online) {
					return b.lastOnline - a.lastOnline;
				}
				return a.online ? -1 : 1;
			});
		}
	);

	let setActivePlayer = (player: CharacterDataWithCoordinates | null) => {
		activePlayerName = player?.name ?? null;
	}


</script>

<div class="flex flex-col lg:flex-row h-full w-full overflow-hidden">
	<!-- Sidebar -->
	<div class="w-64 overflow-y-auto">
		<div class="p-4">
			<Heading class="text-xl">Players Online</Heading>
			<div class="flex justify-between items-center">
				{#if showOffline}
					<P>{players.length} total</P>
				{:else}
					<P>{players.length} online</P>
				{/if}
				<Checkbox bind:checked={showOffline}>Show offline</Checkbox>
			</div>
		</div>
		<div class="p-4 max-h-32 lg:max-h-full">
			{#each players ?? [] as player}
				<div onmouseenter={() => setActivePlayer(player)} onmouseleave={() => setActivePlayer(null)} role="listitem">
					<PlayerCard character={player} />
				</div>

			{:else}
				<P>No players online</P>
			{/each}
		</div>
	</div>

	<!-- Map Area -->
	<div class="flex-1">
		<div class="h-full">
			<DeckGLMap />
			<!-- <Map players={players ?? []} activePlayer={activePlayerName} />  -->
		</div>
	</div>
</div>
