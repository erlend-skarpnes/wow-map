<script lang="ts">
	import { Card } from 'flowbite-svelte';
	import type { ServerStatusData } from '$lib';
	let { serverStatus }: { serverStatus: ServerStatusData }  = $props();

	const formatDuration = (durationInSeconds: number) => {
		const units = [
			{ label: "day", seconds: 86400 },
			{ label: "hour", seconds: 3600 },
			{ label: "minute", seconds: 60 },
			{ label: "second", seconds: 1 }
		];

		const parts = [];

		for (const unit of units) {
			const value = Math.floor(durationInSeconds / unit.seconds);
			if (value > 0) {
				parts.push(`${value} ${unit.label}${value > 1 ? "s" : ""}`);
			}
			durationInSeconds %= unit.seconds;
		}

		return parts.length > 0 ? parts.join(", ") : "0 seconds";
	};
</script>

<Card class="p-4 sm:p-6 md:p-8">
	<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Server status</h5>
	<p>Status: {serverStatus.isUp ? '🟢 Up' : '🔴 Down'}</p>
	{#if serverStatus.isUp}
		<p>Uptime: {formatDuration(serverStatus.uptime)}</p>
		<p>Players online: {serverStatus.playersOnline}</p>
	{/if}
</Card>