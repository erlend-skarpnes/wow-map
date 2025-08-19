<script lang="ts">
	import { Card, Heading, P } from 'flowbite-svelte';
	import type { ServerStatusData } from '$lib/server';
	import { formatDuration } from '$lib';

	let { serverStatus }: { serverStatus: ServerStatusData }  = $props();

	</script>

<Card class="p-4 sm:p-6 md:p-8">
	<Heading class="mb-2 text-2xl font-bold tracking-tight">Server status</Heading>
	<P>Status: {serverStatus.isUp ? '🟢 Up' : '🔴 Down'}</P>
	{#if serverStatus.isUp}
		<P>Uptime: {formatDuration(serverStatus.uptime)}</P>
	{/if}
</Card>