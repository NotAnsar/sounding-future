import { addListeningHistory } from '@/db/history';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
	const { trackId } = await req.json();

	try {
		const newHistory = await addListeningHistory(trackId);

		return NextResponse.json(newHistory, { status: 200 });
	} catch (error) {
		console.error('Error adding listening history:', error);
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 }
		);
	}
}

export async function OPTIONS() {
	return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
}
