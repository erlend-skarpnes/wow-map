import type { PageServerLoad } from '../../.svelte-kit/types/src/routes/map/$types';
import { getServerInfo } from '$lib';

export const load: PageServerLoad = async () => {
	const serverStatus = await getServerInfo();

	return { serverStatus };
}