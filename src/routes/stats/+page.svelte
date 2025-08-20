<script lang="ts">
	import { P, Card, Heading } from 'flowbite-svelte';
	import { formatDuration, formatMoney } from '$lib';
	import type { CharacterStatsData } from '$lib/server';

	const { data }: {data: {stats: CharacterStatsData }} = $props();

</script>

<div class="container mx-auto px-4 py-8">
	<Heading tag="h1" class="text-4xl text-center mb-8">Character Leaderboards</Heading>

	<div class="grid gap-6 justify-center" style="grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));">
		<Card class="p-4">
			<Heading class="text-2xl text-center mb-4 border-b pb-2">Highest Level</Heading>
			<div class="space-y-2">
				{#each data.stats.level as line, index}
					<div class="flex flex-row justify-between items-center p-2 rounded {index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-700' : ''}">
						<div class="flex items-center">
							<P class="font-medium">{line.name}</P>
						</div>
						<P class="font-bold">{line.value}</P>
					</div>
				{/each}
			</div>
		</Card>

		<Card class="p-4">
			<Heading class="text-2xl text-center mb-4 border-b pb-2">Longest Playtime</Heading>
			<div class="space-y-2">
				{#each data.stats.playtime as line, index}
					<div class="flex flex-row justify-between items-center p-2 rounded {index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-700' : ''}">
						<div class="flex items-center">
							<P class="font-medium">{line.name}</P>
						</div>
						<P class="font-bold">{formatDuration(line.value)}</P>
					</div>
				{/each}
			</div>
		</Card>

		<Card class="p-4">
			<Heading class="text-2xl text-center mb-4 border-b pb-2">Most Money</Heading>
			<div class="space-y-2">
				{#each data.stats.money as line, index}
					<div class="flex flex-row justify-between items-center p-2 rounded {index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-700' : ''}">
						<div class="flex items-center">
							<P class="font-medium">{line.name}</P>
						</div>
						<P class="font-bold">{formatMoney(line.value)}</P>
					</div>
				{/each}
			</div>
		</Card>

		<Card class="p-4">
			<Heading class="text-2xl text-center mb-4 border-b pb-2">Most Quests</Heading>
			<div class="space-y-2">
				{#each data.stats.quests as line, index}
					<div class="flex flex-row justify-between items-center p-2 rounded {index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-700' : ''}">
						<div class="flex items-center">
							<P class="font-medium">{line.name}</P>
						</div>
						<P class="font-bold">{line.value}</P>
					</div>
				{/each}
			</div>
		</Card>

		<Card class="p-4">
			<Heading class="text-2xl text-center mb-4 border-b pb-2">Highest Profession</Heading>
			<div class="space-y-2">
				{#each data.stats.profession as line, index}
					<div class="flex flex-row justify-between items-center p-2 rounded {index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-700' : ''}">
						<div class="flex items-center">
							<P class="font-medium">{line.name}</P>
						</div>
						<P class="font-bold">{line.value}</P>
					</div>
				{/each}
			</div>
		</Card>
	</div>
</div>
