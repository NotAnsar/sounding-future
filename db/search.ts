import { prisma } from '@/lib/prisma';
import { Artist, Prisma } from '@prisma/client';

export type SearchedTrack = Prisma.TrackGetPayload<{
	include: {
		artists: { include: { artist: true }; orderBy: { order: 'asc' } };
	};
}>;

export async function searchTrack(
	query: string,
	limit: number = 5
): Promise<SearchedTrack[]> {
	try {
		const data = await prisma.track.findMany({
			where: {
				OR: [
					{ title: { contains: query.trim(), mode: 'insensitive' } },
					{
						slug: {
							contains: query.trim().replace(/ /g, '-'),
							mode: 'insensitive',
						},
					},
				],
				published: true,
			},
			include: {
				artists: { include: { artist: true }, orderBy: { order: 'asc' } },
			},
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
				OR: [
					{ name: { contains: query.trim(), mode: 'insensitive' } },
					{
						slug: {
							contains: query.trim().replace(/ /g, '-'),
							mode: 'insensitive',
						},
					},
				],
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
