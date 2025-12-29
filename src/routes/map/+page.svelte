<script lang="ts">
	import type { AccountOverviewData, CharacterDataWithCoordinates } from '$lib/server';
	import DeckGLMap from '$lib/components/DeckGLMap.svelte';

	let { data }: { data: { players: AccountOverviewData<CharacterDataWithCoordinates>[] } } = $props();

	let showOffline = $state(false);

	let players = $derived.by(() => {

			let allPlayers = data.players.flatMap(player => player.characters).filter(player => player.level > 1) as CharacterDataWithCoordinates[];

			if (showOffline === false) {
				return allPlayers.filter(player => player.online === true);
			}
			return allPlayers.sort((a, b) => {
				if (a.online === b.online) {
					return b.lastOnline - a.lastOnline;
				}
				return a.online ? -1 : 1;
			});
		}
	);


</script>

<DeckGLMap players={data.players.flatMap(player => player.characters) ?? []} />
