import type { PageServerLoad } from '../../../.svelte-kit/types/src/routes/map/$types';
import { getFromDb } from '$lib/server';

export const load: PageServerLoad = async () => {
	const players = await getFromDb();

	return { players };
}