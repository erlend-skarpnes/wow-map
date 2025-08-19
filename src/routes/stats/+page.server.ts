import type { PageServerLoad } from '../../../.svelte-kit/types/src/routes/map/$types';
import { getStats } from '$lib/server';

export const load: PageServerLoad = async (event) => {

	const stats = await getStats();

	return { stats };
};