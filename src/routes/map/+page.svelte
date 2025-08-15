<script lang="ts">
	import Map from '$lib/components/Map.svelte';
	import type { AccountData, CharacterDataWithCoordinates } from '$lib';
	import { Checkbox, Heading, P } from 'flowbite-svelte';
	import PlayerCard from '$lib/components/PlayerCard.svelte';

	let { data }: { data: { players: AccountData<CharacterDataWithCoordinates>[] } } = $props();

	let showBots = $state(false);
	let activePlayerName: string | null = $state(null);


	let players = $derived.by(() => {
			if (showBots === false) {
				return data.players.filter(player => player.account.startsWith("RNDBOT") === false);
			}
			return data.players;
		}
	);

	let setActivePlayer = (player: AccountData<CharacterDataWithCoordinates> | null) => {
		activePlayerName = player?.character?.name ?? null;
	}


</script>

<div class="flex h-screen w-full overflow-hidden">
	<!-- Sidebar -->
	<div class="w-64 overflow-y-auto">
		<div class="p-4">
			<Heading class="text-xl">Players Online</Heading>
			<div class="flex justify-between items-center">
				<P>{players.length} online</P>
				<Checkbox bind:checked={showBots}>Show bots</Checkbox>
			</div>
		</div>
		<div class="p-4">
			{#each players ?? [] as player}
				<div onmouseenter={() => setActivePlayer(player)} onmouseleave={() => setActivePlayer(null)} role="listitem">
					<PlayerCard player={player} />
				</div>

			{:else}
				<P>No players online</P>
			{/each}
		</div>
	</div>

	<!-- Map Area -->
	<div class="flex-1">
		<div class="h-full">
			<Map players={players ?? []} activePlayer={activePlayerName}/>
		</div>
	</div>
</div>
