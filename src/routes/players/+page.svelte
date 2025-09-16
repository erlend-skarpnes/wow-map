<script lang="ts">
	import type { AccountOverviewData, CharacterData } from '$lib/server';
	import { A, Card, Heading, Li, List, P } from 'flowbite-svelte';
	import PlayerCard from '$lib/components/PlayerCard.svelte';

	let { data }: { data: { accounts: AccountOverviewData<CharacterData>[] } } = $props();

	const players = data.accounts.sort((a, b) => b.account > a.account ? -1 : 1);
</script>

<div class="container mx-auto px-4 py-8">
	<Heading tag="h1" class="text-4xl text-center mb-8">Players</Heading>

	<div class="grid gap-6 justify-center" style="grid-template-columns: repeat(auto-fit, minmax(350px, 350px));">
		{#each players as player}
			<Card class="p-4">
				<Heading class="text-2xl text-center mb-4 border-b pb-2">{player.account[0].toUpperCase() + player.account.slice(1).toLowerCase()}</Heading>
				<div class="space-y-2">
					{#each player.characters.sort((a, b) => b.level - a.level) as character}
						<PlayerCard {character} />
					{/each}
				</div>
			</Card>
			{/each}
	</div>
</div>