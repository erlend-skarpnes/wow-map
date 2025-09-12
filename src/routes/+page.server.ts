import type { PageServerLoad } from '../../.svelte-kit/types/src/routes/map/$types';
import { getOnlineAccounts, getServerInfo } from '$lib/server';

export const load: PageServerLoad = async () => {
	const serverStatus = await getServerInfo();
	const players = await getOnlineAccounts();

	return { serverStatus, players };
}