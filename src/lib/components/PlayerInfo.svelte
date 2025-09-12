<script lang="ts">
	import type { AccountData } from '$lib/server';
	import { Card, Heading, P } from 'flowbite-svelte';
	import PlayerCard from '$lib/components/PlayerCard.svelte';
	import { capitalizeFirst } from '$lib';

	let { players }: { players: AccountData[] } = $props<{ players: AccountData[] }>();
	const onlinePlayers = players.filter(p => p.online);
	const offlinePlayers = players.filter(p => !p.online && !p.account.startsWith('RNDBOT'));

	</script>

<Card class="p-4 overflow-y-auto">
	<Heading class="mx-4 mb-2 text-2xl font-bold tracking-tight">Online</Heading>
		{#if onlinePlayers.length === 0}
			<P class="mx-4">No players online</P>
		{:else}
		{#each onlinePlayers as player}
			<PlayerCard character={player.character} accountName={player.account} />
		{/each}
	{/if}
</Card>