<script lang="ts">
	import { P, Avatar, Card } from 'flowbite-svelte';
	import type { AccountData, CharacterData } from '$lib';

	let { player }: { player: AccountData } = $props();

	const getPortrait = (character: CharacterData | null): string | undefined => {
		if (character == null) return undefined;
		return `/races/${character.race.replace(' ', '').toLowerCase()}-${character.gender.toLowerCase()}.jpg`;
	};

	const getClassPicture = (character: CharacterData | null): string | undefined => {
		if (character == null) return undefined;
		return `/classes/${character.class.toLowerCase()}.jpg`;
	};
</script>

<Card class="my-1 p-1 px-4">
	<div class="flex-row flex gap-2 w-full justify-between">
		<div>
			<P class="font-medium">{player.character?.name}</P>
			<P class="font-extralight">{player.account}</P>
		</div>
		<div class="flex flex-row gap-1 justify-end items-center">
			<Avatar src={getPortrait(player.character)} />
			<Avatar src={getClassPicture(player.character)} />
		</div>
	</div>
</Card>