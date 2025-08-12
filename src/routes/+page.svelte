<script lang="ts">
	import ServerStatus from '$lib/components/ServerStatus.svelte';
	import type { AccountData, ServerStatusData } from '$lib';
	import PlayerInfo from '$lib/components/PlayerInfo.svelte';
	import { Card, Heading, P, A, List, Li } from 'flowbite-svelte';
	import { PUBLIC_DOWNLOAD_LINK } from '$env/static/public';

	let { data }: { data: { serverStatus: ServerStatusData, players: AccountData[] } } = $props();

</script>

<div class="flex flex-row justify-center gap-16 p-8">
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
	</div>

	<div class="flex flex-col gap-4 p-4 min-w-82">
		<ServerStatus serverStatus={data.serverStatus} />
		<PlayerInfo players={data.players} />
	</div>
</div>
