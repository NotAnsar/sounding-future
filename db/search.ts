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
			where: {
				title: { contains: query.trim(), mode: 'insensitive' },
				published: true,
			},
			include: { artist: true },
			take: limit,
			orderBy: { createdAt: 'desc' },
		});

		return data;
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			console.error(`[Database Error ${error.code}]: ${error.message}`, {
				query,
				error: error.stack,
			});
			return [];
		}

		if (error instanceof Prisma.PrismaClientValidationError) {
			console.error('[Validation Error]:', {
				query,
				error: error.message,
				stack: error.stack,
			});
			return [];
		}

		console.error('[Unexpected Error] Error searching tracks:', {
			query,
			error: error instanceof Error ? error.message : String(error),
			stack: error instanceof Error ? error.stack : undefined,
		});
		return [];
	}
}

export async function searchArtist(
	query: string,
	limit: number = 5
): Promise<Artist[]> {
	try {
		const data = await prisma.artist.findMany({
			where: {
				name: { contains: query.trim(), mode: 'insensitive' },
				published: true,
			},
			orderBy: { createdAt: 'desc' },
			take: limit,
		});

		return data;
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			console.error(`[Database Error ${error.code}]: ${error.message}`, {
				query,
				error: error.stack,
			});
			return [];
		}

		if (error instanceof Prisma.PrismaClientValidationError) {
			console.error('[Validation Error]:', {
				query,
				error: error.message,
				stack: error.stack,
			});
			return [];
		}

		console.error('[Unexpected Error] Error searching artists:', {
			query,
			error: error instanceof Error ? error.message : String(error),
			stack: error instanceof Error ? error.stack : undefined,
		});
		return [];
	}
}

export async function search(query: string) {
	const tracks = await searchTrack(query);
	const artists = await searchArtist(query);
	return { tracks, artists };
}
