<script lang="ts">
	import type { AccountData } from '$lib/server';
	import { Card, Heading, P } from 'flowbite-svelte';
	import PlayerCard from '$lib/components/PlayerCard.svelte';

	let { players }: { players: AccountData[] } = $props<{ players: AccountData[] }>();
	const onlinePlayers = players.filter(p => p.online);
	const offlinePlayers = players.filter(p => !p.online && !p.account.startsWith('RNDBOT'));

</script>

<Card class="p-4 overflow-y-auto">
	<Heading class="mx-4 mb-2 text-2xl font-bold tracking-tight">Players</Heading>
		{#if onlinePlayers.length === 0}
			<P class="mx-4">No players online</P>
		{:else}
		{#each onlinePlayers as player}
			<PlayerCard player={player} />
		{/each}
	{/if}

	<div class="mx-4 mt-4">
		<Heading class="text-lg">Offline</Heading>
		{#each offlinePlayers as player}
			<div class="text-sm pt-1">
				<P class="font-medium">{player.account}</P>
			</div>
		{/each}
	</div>
</Card>