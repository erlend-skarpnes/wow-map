<script lang="ts">
	import { Avatar, type AvatarProps, Indicator } from 'flowbite-svelte';
	import type { CharacterData } from '$lib/server';

	interface Props extends Pick<AvatarProps, 'class' | 'size'> {
		character: CharacterData;
	}


	let { character, class: className, size = "md" }: Props = $props();

	const getPortrait = (character: CharacterData): string | undefined => {
		if (character == null) return undefined;
		return `/races/${character.race.replace(' ', '').toLowerCase()}-${character.gender.toLowerCase()}.jpg`;
	};

	const getClassPicture = (character: CharacterData): string | undefined => {
		if (character == null) return undefined;
		return `/classes/${character.class.toLowerCase()}.jpg`;
	};

	const getIndicatorSize = () => {
		switch (size) {
			case "xs":
				return "size-4";
			case "sm":
				return "size-5";
			case "md":
				return "size-6";
			case "lg":
				return "size-10";
			case "xl":
				return "size-12";
		}
	}

</script>

<Avatar src={getPortrait(character)} class={className} {size}>
	{#snippet indicator()}
		<Indicator placement="top-right" class={["border", {"border-green-600": character.online}, getIndicatorSize()]}>
			<img src={getClassPicture(character)} alt={character?.class} class={["rounded-full"]}/>
		</Indicator>
	{/snippet}
</Avatar>