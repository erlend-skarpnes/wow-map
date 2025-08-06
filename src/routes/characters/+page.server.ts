import type { PageServerLoad } from "../$types";
import { getCharacters } from '$lib';

export const load: PageServerLoad = async (event) => {
	const players = await getCharacters();
	console.log(players);
	return { players };
};