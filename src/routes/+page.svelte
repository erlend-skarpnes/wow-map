<script lang="ts">
	import  ServerStatus from '$lib/components/ServerStatus.svelte';
	import type { ServerStatusData } from '$lib';

	let { data }: { data: { serverStatus: ServerStatusData } } = $props();

</script>

<div class="flex flex-col justify-around md:flex-row gap-4 p-4 w-full">
		<ServerStatus serverStatus={data.serverStatus} />
</div>

