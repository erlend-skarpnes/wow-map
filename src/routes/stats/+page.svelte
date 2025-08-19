<script lang="ts">
	import { P, Card, Heading } from 'flowbite-svelte';
	import { formatDuration, formatMoney } from '$lib';
	import type { CharacterStatsData } from '$lib/server';

	const { data }: {data: {stats: CharacterStatsData }} = $props();

</script>

<div class="flex flex-col sm:flex-row justify-center gap-16 p-8">
	<Card class="p-4">
		<Heading class="text-2xl">Highest level</Heading>
			{#each data.stats.level as line}
				<div class="flex flex-row justify-between">
					<P>{line.name}</P>
					<P>{line.value}</P>
				</div>
			{/each}
	</Card>
	<Card class="p-4">
		<Heading class="text-2xl">Longest playtime</Heading>
		{#each data.stats.playtime as line}
			<div class="flex flex-row justify-between">
				<P>{line.name}</P>
				<P>{formatDuration(line.value)}</P>
			</div>
		{/each}
	</Card>
	<Card class="p-4">
		<Heading class="text-2xl">Most money</Heading>
		{#each data.stats.money as line}
			<div class="flex flex-row justify-between">
				<P>{line.name}</P>
				<P>{formatMoney(line.value)}</P>
			</div>
		{/each}
	</Card>
	<Card class="p-4">
		<Heading class="text-2xl">Most quests</Heading>
		{#each data.stats.quests as line}
			<div class="flex flex-row justify-between">
				<P>{line.name}</P>
				<P>{line.value}</P>
			</div>
		{/each}
	</Card>
	<Card class="p-4">
		<Heading class="text-2xl">Highest profession level</Heading>
		{#each data.stats.profession as line}
			<div class="flex flex-row justify-between">
				<P>{line.name}</P>
				<P>{line.value}</P>
			</div>
		{/each}
	</Card>
</div>