import { NextRequest, NextResponse } from 'next/server';

export async function GET(
	request: NextRequest,
	{ params }: { params: { fileId: string } }
) {
	try {
		const { fileId } = params;

		// Construct the object storage URL
		const fileUrl = `https://sfdata01.fsn1.your-objectstorage.com/sfdata01/downloads/${fileId}`;

		// Fetch the file from object storage
		const response = await fetch(fileUrl);

		if (!response.ok) {
			return NextResponse.json({ error: 'File not found' }, { status: 404 });
		}

		// Get the file as a buffer
		const arrayBuffer = await response.arrayBuffer();

		// Get content type from the original response
		const contentType =
			response.headers.get('content-type') || 'application/octet-stream';

		// Create response with proper headers
		return new NextResponse(arrayBuffer, {
			headers: {
				'Content-Type': contentType,
				'Content-Disposition': `attachment; filename="${fileId}"`,
				'Content-Length': arrayBuffer.byteLength.toString(),
			},
		});
	} catch (error) {
		console.error('Download proxy error:', error);
		return NextResponse.json({ error: 'Download failed' }, { status: 500 });
	}
}
