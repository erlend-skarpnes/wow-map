import type { PageServerLoad } from '../../.svelte-kit/types/src/routes/map/$types';
import { getAccounts, getServerInfo } from '$lib/server';

export const load: PageServerLoad = async () => {
	const serverStatus = await getServerInfo();
	const players = await getAccounts();

	return { serverStatus, players };
}