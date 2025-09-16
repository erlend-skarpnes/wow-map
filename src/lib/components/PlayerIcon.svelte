<script lang="ts">
	import { Avatar, Indicator } from "flowbite-svelte";
	import type { CharacterData } from '$lib/server';

	let { character }: { character: CharacterData} = $props();

	const getPortrait = (character: CharacterData | null): string | undefined => {
		if (character == null) return undefined;
		return `/races/${character.race.replace(' ', '').toLowerCase()}-${character.gender.toLowerCase()}.jpg`;
	};

	const getClassPicture = (character: CharacterData | null): string | undefined => {
		if (character == null) return undefined;
		return `/classes/${character.class.toLowerCase()}.jpg`;
	};
</script>

<Avatar src={getPortrait(character)}>
{#snippet indicator()}
	<Indicator size="xl" placement="top-right" class={["border", {"border-green-600": character.online}]}>
		<img src={getClassPicture(character)} alt={character?.class} class={["rounded-full"]}/>
	</Indicator>
{/snippet}
</Avatar>