import { prisma } from '@/lib/prisma';
import { Artist, Prisma } from '@prisma/client';

export type SearchedTrack = Prisma.TrackGetPayload<{
	include: { artist: true };
}>;

export async function searchTrack(
	query: string,
	limit: number = 5
): Promise<SearchedTrack[]> {
	try {
		const data = await prisma.track.findMany({
			where: { title: { contains: query.trim(), mode: 'insensitive' } },
			include: { artist: true },
			take: limit,
			orderBy: { createdAt: 'desc' },
		});

		return data;
	} catch (error) {
		console.log(error);

		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			// Handle specific Prisma errors
			console.error(`Database error: ${error.code}`, error);
			throw new Error(`Database error: ${error.message}`);
		}

		if (error instanceof Prisma.PrismaClientValidationError) {
			console.error('Validation error:', error);
			throw new Error('Invalid data provided');
		}

		// Generic error handling
		console.error('Error searching tracks:', error);
		throw new Error('Unable to search tracks. Please try again later.');
	}
}

export async function searchArtist(
	query: string,
	limit: number = 5
): Promise<Artist[]> {
	try {
		const data = await prisma.artist.findMany({
			where: { name: { contains: query.trim(), mode: 'insensitive' } },
			orderBy: { createdAt: 'desc' },
			take: limit,
		});

		return data;
	} catch (error) {
		console.log(error);

		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			// Handle specific Prisma errors
			console.error(`Database error: ${error.code}`, error);
			throw new Error(`Database error: ${error.message}`);
		}

		if (error instanceof Prisma.PrismaClientValidationError) {
			console.error('Validation error:', error);
			throw new Error('Invalid data provided');
		}

		// Generic error handling
		console.error('Error searching artists:', error);
		throw new Error('Unable to search artists. Please try again later.');
	}
}

export async function search(query: string) {
	const tracks = await searchTrack(query);
	const artists = await searchArtist(query);
	return { tracks, artists };
}
