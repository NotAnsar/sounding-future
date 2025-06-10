import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const url = searchParams.get('url');

		if (!url) {
			return NextResponse.json(
				{ error: 'URL parameter required' },
				{ status: 400 }
			);
		}

		// Validate that it's one of your HLS URLs
		if (!url.includes('sfdata01.fsn1.your-objectstorage.com')) {
			return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
		}

		const response = await fetch(url, {
			headers: {
				'User-Agent':
					'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
			},
		});

		if (!response.ok) {
			console.error(
				'❌ Failed to fetch HLS file:',
				response.status,
				response.statusText
			);
			return NextResponse.json(
				{ error: `Failed to fetch: ${response.status}` },
				{ status: response.status }
			);
		}

		const contentType =
			response.headers.get('content-type') || 'application/octet-stream';
		const data = await response.arrayBuffer();

		// If it's a playlist, modify URLs to use proxy
		if (url.endsWith('.m3u8')) {
			const textContent = new TextDecoder().decode(data);

			// Replace segment URLs with proxied versions
			const modifiedContent = textContent
				.split('\n')
				.map((line) => {
					const trimmedLine = line.trim();

					// If line is a full URL (starts with http), proxy it
					if (trimmedLine.startsWith('http')) {
						const proxiedUrl = `/api/hls-proxy?url=${encodeURIComponent(
							trimmedLine
						)}`;

						return proxiedUrl;
					}

					return line;
				})
				.join('\n');

			return new NextResponse(modifiedContent, {
				status: 200,
				headers: {
					'Content-Type': 'application/x-mpegURL',
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
					'Access-Control-Allow-Headers': '*',
					'Cache-Control': 'public, max-age=3600',
				},
			});
		}

		return new NextResponse(data, {
			status: 200,
			headers: {
				'Content-Type': contentType,
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
				'Access-Control-Allow-Headers': '*',
				'Cache-Control': 'public, max-age=3600',
			},
		});
	} catch (error) {
		console.error('❌ HLS proxy error:', error);
		return NextResponse.json(
			{ error: 'Failed to proxy HLS file' },
			{ status: 500 }
		);
	}
}

export async function OPTIONS() {
	return new NextResponse(null, {
		status: 200,
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
			'Access-Control-Allow-Headers': '*',
		},
	});
}
