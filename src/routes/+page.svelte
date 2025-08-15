<script lang="ts">
	import ServerStatus from '$lib/components/ServerStatus.svelte';
	import type { AccountData, ServerStatusData } from '$lib';
	import PlayerInfo from '$lib/components/PlayerInfo.svelte';
	import { Card, Heading, P, A, List, Li } from 'flowbite-svelte';
	import { PUBLIC_DOWNLOAD_LINK } from '$env/static/public';

	let { data }: { data: { serverStatus: ServerStatusData, players: AccountData[] } } = $props();

</script>

<div class="flex flex-col md:flex-row justify-center gap-16 p-8">
	<div class="justify-around gap-4 p-4 max-w-2xl">
		<Heading tag="h1" class="mb-4">Welcome to World of Noobs</Heading>

		<P class="mb-2">
			Welcome! To play on this server, you must first have an account.
			Any 1.12 client should be able to be used, but a ready-made client can be <A href={PUBLIC_DOWNLOAD_LINK} target="_blank">downloaded here</A>.
		</P>

		<P class="mb-2">
			In order to change the password of your account, the following command must be written in the in-game chat:
			<br>
			<code>.account password <i>old_password new_password new_password</i></code>
		</P>

		<Heading class="mt-4 text-4xl">Rules</Heading>
		<List class="space-y-1 text-gray-900 dark:text-white">
			<Li>300% XP from quests</Li>
			<Li>Higher droprate on world drops</Li>
			<Li>No limit on professions</Li>
			<Li>Mount at level 20</Li>
			<Li>World is full of helpful bots</Li>
			<Li>50% more talent points</Li>
			<Li>200% reputation gain</Li>
			<Li>Supercharged rested xp gain when online in rested areas</Li>
		</List>
	</div>

	<div class="flex flex-col gap-4 p-4 min-w-82">
		<ServerStatus serverStatus={data.serverStatus} />
		<PlayerInfo players={data.players} />
	</div>
</div>
