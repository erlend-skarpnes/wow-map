<script lang="ts">
	import type { AccountOverviewData } from '$lib/server';
	import { A, Card, Heading, Li, List, P } from 'flowbite-svelte';
	import PlayerCard from '$lib/components/PlayerCard.svelte';

	let { data }: { data: { accounts: Record<string, AccountOverviewData> } } = $props();

	const players = Object.keys(data.accounts).sort();
</script>

<div class="container mx-auto px-4 py-8">
	<Heading tag="h1" class="text-4xl text-center mb-8">Players</Heading>

	<div class="grid gap-6 justify-center" style="grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));">
		{#each players as player}
			<Card class="p-4">
				<Heading class="text-2xl text-center mb-4 border-b pb-2">{player[0].toUpperCase() + player.slice(1).toLowerCase()}</Heading>
				<div class="space-y-2">
					{#each data.accounts[player].characters.sort((a, b) => b.level - a.level) as character}
						<PlayerCard {character} />
					{/each}
				</div>
			</Card>
			{/each}
	</div>
</div>