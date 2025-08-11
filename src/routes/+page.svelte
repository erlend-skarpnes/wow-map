<script lang="ts">
	import  ServerStatus from '$lib/components/ServerStatus.svelte';
	import type { AccountData, ServerStatusData } from '$lib';
	import PlayerInfo from '$lib/components/PlayerInfo.svelte';

	let { data }: { data: { serverStatus: ServerStatusData, players: AccountData[] } } = $props();

</script>

<div>
	Info
</div>
	<div class="flex flex-col justify-around gap-4 p-4">
		<ServerStatus serverStatus={data.serverStatus} />
		<PlayerInfo players={data.players} />
	</div>
