<script lang="ts">
	import Map from '$lib/components/Map.svelte';
	import type { PlayerInfo } from '$lib';

	let { data }: { data: { players: PlayerInfo[] } } = $props();

	let showBots = $state(false);

	let players = $derived.by(() => {
			if (showBots === false) {
				return data.players.filter(player => player.account.startsWith("RNDBOT") === false);
			}
			return data.players;
		}
	);
</script>

<div class="flex h-screen w-full overflow-hidden">
	<!-- Sidebar -->
	<div class="w-64 bg-gray-800 text-white overflow-y-auto shadow-lg">
		<div class="p-4 border-b border-gray-700">
			<h2 class="text-xl font-bold">Players Online</h2>
			<div class="flex justify-between items-center">
				<div class="p-3 text-gray-400">{players.length} online</div>
				<div class="flex items-center">
					<span class="text-sm mr-2">Show Bots</span>
					<button
						aria-label="toggle bots"
						class="relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
						class:bg-blue-600={showBots}
						class:bg-gray-600={!showBots}
						onclick={() => showBots = !showBots}
						aria-checked={showBots}
						role="switch"
					>
						<span 
							class="inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200"
							class:translate-x-6={showBots}
							class:translate-x-1={!showBots}
						></span>
					</button>
				</div>
			</div>
		</div>
		<div class="p-2">
			{#each players ?? [] as player}
				<div class="p-3 mb-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors">
					<div class="font-medium">{player.name}, {player.level}</div>
					<div class="text-sm text-gray-300">Account: {player.account}</div>
					<div class="text-sm text-gray-300">Race: {player.race}</div>

				</div>
			{:else}
				<div class="p-3 text-gray-400">No players online</div>
			{/each}
		</div>
	</div>

	<!-- Map Area -->
	<div class="flex-1 bg-gray-100">
		<div class="h-full">
			<Map players={players ?? []}/>
		</div>
	</div>
</div>
