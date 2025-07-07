<script lang="ts">
	import Map from '$lib/components/Map.svelte';

	let { data } = $props();
</script>

<div class="flex h-screen w-full overflow-hidden">
	<!-- Sidebar -->
	<div class="w-64 bg-gray-800 text-white overflow-y-auto shadow-lg">
		<div class="p-4 border-b border-gray-700">
			<h2 class="text-xl font-bold">Players Online</h2>
			<div class="p-3 text-gray-400">{data.players.length} online</div>
		</div>
		<div class="p-2">
			{#each data.players ?? [] as player}
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
			<Map players={data.players ?? []}/>
		</div>
	</div>
</div>
