import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Prisma, type Artist } from '@prisma/client';
import { AuthenticationError, UserNotFoundError } from './user';

// class ArtistError extends Error {
// 	constructor(message: string, public readonly cause?: unknown) {
// 		super(message);
// 		this.name = 'ArtistError';
// 	}
// }

type ArtistRes = { data: Artist[]; error?: boolean; message?: string };

export async function getArtists(limit?: number): Promise<ArtistRes> {
	try {
		const data = await prisma.artist.findMany({
			where: { published: true },
			orderBy: { tracks: { _count: 'desc' } },
			take: limit,
		});

		return { data, error: false };
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			// Handle specific Prisma errors
			console.error(`Database error: ${error.code}`, error);
			// throw new ArtistError(`Database error: ${error.message}`);
			return { data: [], error: true, message: error.message };
		}

		if (error instanceof Prisma.PrismaClientValidationError) {
			console.error('Validation error:', error);
			return { data: [], error: true, message: 'Invalid data provided' };
		}

		console.error('Error fetching artists:', error);

		return {
			data: [],
			error: true,
			message: 'Unable to retrieve artists. Please try again later.',
		};
	}
}

export async function getSimilarArtists(
	genres: string[],
	limit?: number,
	artistId?: string
): Promise<ArtistRes> {
	try {
		const data = await prisma.artist.findMany({
			orderBy: { tracks: { _count: 'desc' } },
			where: {
				published: true,
				genres:
					genres.length > 0
						? { some: { genre: { id: { in: genres } } } }
						: undefined,
				id: { not: artistId },
			},
			take: limit,
		});

		return { data, error: false };
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			// Handle specific Prisma errors
			console.error(`Database error: ${error.code}`, error);
			return {
				data: [],
				error: true,
				message: `Database error: ${error.message}`,
			};
			// throw new ArtistError(`Database error: ${error.message}`);
		}

		if (error instanceof Prisma.PrismaClientValidationError) {
			console.error('Validation error:', error);
			// throw new ArtistError('Invalid data provided');
			return { data: [], error: true, message: 'Invalid data provided' };
		}

		// Generic error handling
		console.error('Error fetching artists:', error);
		// throw new ArtistError(
		// 	'Unable to retrieve artists. Please try again later.',
		// 	error
		// );
		return { data: [], error: true, message: 'Unable to retrieve artists' };
	}
}

export type ArtistDetails = Prisma.ArtistGetPayload<{
	include: {
		genres: { include: { genre: true } };
		socialLinks: true;
		articles: { include: { article: true } };
	};
}>;

export async function getArtistsById(
	id: string
): Promise<ArtistDetails | undefined> {
	try {
		const data = await prisma.artist.findUnique({
			where: { id, published: true },
			include: {
				genres: { include: { genre: true } },
				socialLinks: true,
				articles: { include: { article: true } },
			},
		});

		if (!data) {
			return undefined;
		}

		return data;
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			// Handle specific Prisma errors
			console.error(`Database error: ${error.code}`, error);
			// throw new ArtistError(`Database error: ${error.message}`);
		}

		if (error instanceof Prisma.PrismaClientValidationError) {
			console.error('Validation error:', error);
			// throw new ArtistError('Invalid data provided');
		}

		// Generic error handling
		console.error('Error fetching artists:', error);
		// throw new ArtistError(
		// 	'Unable to retrieve artists. Please try again later.',
		// 	error
		// );
		return undefined;
	}
}

export type ArtistList = Prisma.ArtistGetPayload<{
	include: {
		genres: { include: { genre: true } };
		_count: { select: { tracks: true } };
	};
}>;

export async function getArtistsList(
	limit?: number
): Promise<{ data: ArtistList[]; error?: boolean; message?: string }> {
	try {
		const data = await prisma.artist.findMany({
			where: { published: true },
			orderBy: { tracks: { _count: 'desc' } },
			include: {
				genres: { include: { genre: true } },
				_count: { select: { tracks: true } },
			},
			take: limit,
		});

		return { data, error: false };
	} catch (error) {
		let message = 'Unable to retrieve artists. Please try again later.';
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			// Handle specific Prisma errors
			console.error(`Database error: ${error.code}`, error);
			message = `Database error: ${error.code}`;
		}

		if (error instanceof Prisma.PrismaClientValidationError) {
			console.error('Validation error:', error);
			message = 'Invalid data provided';
		}

		// Generic error handling
		console.error('Error fetching artists:', error);
		return { data: [], error: true, message };
	}
}

export async function getMyArtist(): Promise<myArtistData | undefined> {
	try {
		const session = await auth();

		if (!session?.user?.email) {
			throw new AuthenticationError();
		}

		const data = await prisma.user.findUnique({
			where: { email: session.user.email },
			include: { artist: { include: { genres: true, socialLinks: true } } },
		});

		if (!data) {
			throw new UserNotFoundError(session.user.email);
		}

		return data?.artist || undefined;
	} catch (error) {
		return undefined;
	}
}

export type myArtistData = Prisma.ArtistGetPayload<{
	include: { genres: true; socialLinks: true };
}>;

export type ArtistStats = Prisma.ArtistGetPayload<{
	include: {
		genres: { include: { genre: true } };
		_count: { select: { tracks: true } };
		tracks: {
			select: {
				_count: { select: { listeners: true; likes: true } };
			};
		};
	};
}> & { played: number; liked: number };

type ArtistStatRes = { data: ArtistStats[]; error?: boolean; message?: string };

export async function getArtistsStats(limit?: number): Promise<ArtistStatRes> {
	try {
		const data = await prisma.artist.findMany({
			where: { published: true },
			include: {
				genres: { include: { genre: true } },
				_count: { select: { tracks: true } },
				tracks: {
					select: {
						_count: { select: { listeners: true, likes: true } },
					},
				},
			},
			orderBy: { tracks: { _count: 'desc' } },
			take: limit,
		});

		// Calculate total plays across all tracks
		const statsWithPlays = data.map((artist) => ({
			...artist,
			played: artist.tracks.reduce((s, t) => s + t._count.listeners, 0),
			liked: artist.tracks.reduce((sum, track) => sum + track._count.likes, 0),
		}));

		return { data: statsWithPlays, error: false };
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			console.error(`Database error: ${error.code}`, error);
			return { data: [], error: true, message: error.message };
		}
		if (error instanceof Prisma.PrismaClientValidationError) {
			console.error('Validation error:', error);
			return { data: [], error: true, message: 'Invalid data provided' };
		}
		console.error('Error fetching artists:', error);
		return {
			data: [],
			error: true,
			message: 'Unable to retrieve artists. Please try again later.',
		};
	}
}
