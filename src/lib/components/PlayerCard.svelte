<script lang="ts">
	import { P, Avatar, Card } from 'flowbite-svelte';
	import type { AccountData, CharacterData } from '$lib/server';
	import { capitalizeFirst } from '$lib';

	let { character, accountName }: { character: CharacterData, accountName?: string} = $props();

	const getPortrait = (character: CharacterData | null): string | undefined => {
		if (character == null) return undefined;
		return `/races/${character.race.replace(' ', '').toLowerCase()}-${character.gender.toLowerCase()}.jpg`;
	};

	const getClassPicture = (character: CharacterData | null): string | undefined => {
		if (character == null) return undefined;
		return `/classes/${character.class.toLowerCase()}.jpg`;
	};
</script>

<Card class={"my-1 p-1 px-4 hover:bg-gray-400"}>
	<div class="flex-row flex gap-2 w-full justify-between">
		<div>
			<P class="font-medium">{character?.name}</P>
			<P class="font-extralight">Lvl {character?.level}</P>
			<P class="font-extralight">{capitalizeFirst(accountName ?? "")}</P>
		</div>
		<div class="flex flex-row gap-1 justify-end items-center">
			<Avatar src={getPortrait(character)} />
			<Avatar src={getClassPicture(character)} />
		</div>
	</div>
</Card>