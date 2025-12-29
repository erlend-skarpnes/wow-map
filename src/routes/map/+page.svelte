<script lang="ts">
	import type { AccountOverviewData, CharacterDataWithCoordinates } from '$lib/server';
	import DeckGLMap from '$lib/components/DeckGLMap.svelte';

	let { data }: { data: { players: AccountOverviewData<CharacterDataWithCoordinates>[] } } = $props();
</script>

<DeckGLMap players={data.players.flatMap(player => player.characters) ?? []} />
