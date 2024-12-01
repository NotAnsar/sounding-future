import { search } from '@/db/search';

export async function GET(req: Request) {
	const { searchParams } = new URL(req.url);
	const query = searchParams.get('query') || '';

	if (!query.trim()) {
		return new Response(JSON.stringify({ artists: [], tracks: [] }), {
			status: 200,
		});
	}

	try {
		const results = await search(query);

		return new Response(JSON.stringify(results), { status: 200 });
	} catch (error) {
		console.error('Search API error:', error);
		return new Response('Error performing search', { status: 500 });
	}
}
