<script lang="ts">
	import { P, Avatar, Card } from 'flowbite-svelte';
	import type { AccountData, CharacterData } from '$lib/server';
	import { capitalizeFirst } from '$lib';
	import PlayerIcon from '$lib/components/PlayerIcon.svelte';

	let { character, accountName }: { character: CharacterData, accountName?: string} = $props();
</script>

<Card class={"my-1 p-1 px-4 hover:bg-gray-400"}>
	<div class="flex-row flex gap-2 w-full justify-between">
		<div>
			<P class="font-medium">{character?.name}</P>
			<P class="font-extralight">Lvl {character?.level}</P>
			<P class="font-extralight">{capitalizeFirst(accountName ?? "")}</P>
		</div>
		<div class="flex flex-row gap-1 justify-end items-center">
			<PlayerIcon character={character} />
		</div>
	</div>
</Card>