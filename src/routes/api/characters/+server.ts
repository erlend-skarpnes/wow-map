import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const testData = ["Test", "Testesen", "IkkeTestesen"]

export const GET: RequestHandler = async ({url, params, request, route}) => {
	console.log({url, route})
	const query = url.searchParams.get("q");
	return json(testData.filter(d => query && d.startsWith(query)));
}