<script lang="ts">
	import { Card, Input, Button } from "flowbite-svelte";
	import type { PlayerInfo } from '$lib';
	let { data }: { data: { players: PlayerInfo[] } } = $props();

	console.log(data);

	let searchString = $state(undefined);
</script>

<div class="flex flex-col justify-around md:flex-row gap-4 p-4 w-full">
	<Card class="p-4 sm:p-6 md:p-8">
		<Input data={data.players.map(p => p.name)} bind:value={searchString} size="lg">
			{#snippet right()}
				<Button size="sm" type="submit">Search</Button>
			{/snippet}
		</Input>
	</Card>
	<Card>
		<h1>Character</h1>
	</Card>
</div>
