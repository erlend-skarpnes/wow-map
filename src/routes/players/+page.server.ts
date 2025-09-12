import type { PageServerLoad } from '../../../.svelte-kit/types/src/routes/map/$types';
import { getAccounts, getFromDb } from '$lib/server';

export const load: PageServerLoad = async () => {
	const accounts = await getAccounts();

	return { accounts };
}