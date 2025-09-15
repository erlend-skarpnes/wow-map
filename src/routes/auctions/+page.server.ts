import type { PageServerLoad } from '../../../.svelte-kit/types/src/routes/map/$types';
import { getAuctions, getFromDb } from '$lib/server';

export const load: PageServerLoad = async () => {
	const auctions = await getAuctions();

	return { auctions };
}