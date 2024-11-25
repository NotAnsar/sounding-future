import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Prisma, type Artist } from '@prisma/client';
import { AuthenticationError, UserNotFoundError } from './user';

class ArtistError extends Error {
	constructor(message: string, public readonly cause?: unknown) {
		super(message);
		this.name = 'ArtistError';
	}
}

export async function getArtists(limit?: number): Promise<Artist[]> {
	try {
		const data = await prisma.artist.findMany({
			orderBy: { tracks: { _count: 'desc' } },
			take: limit,
		});

		return data;
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			// Handle specific Prisma errors
			console.error(`Database error: ${error.code}`, error);
			throw new ArtistError(`Database error: ${error.message}`);
		}

		if (error instanceof Prisma.PrismaClientValidationError) {
			console.error('Validation error:', error);
			throw new ArtistError('Invalid data provided');
		}

		// Generic error handling
		console.error('Error fetching artists:', error);
		throw new ArtistError(
			'Unable to retrieve artists. Please try again later.',
			error
		);
	}
}

export async function getSimilarArtists(
	genres: string[],
	limit?: number,
	artistId?: string
): Promise<Artist[]> {
	try {
		const data = await prisma.artist.findMany({
			orderBy: { tracks: { _count: 'desc' } },
			where: {
				genres:
					genres.length > 0
						? { some: { genre: { id: { in: genres } } } }
						: undefined,
				id: { not: artistId },
			},
			take: limit,
		});

		return data;
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			// Handle specific Prisma errors
			console.error(`Database error: ${error.code}`, error);
			throw new ArtistError(`Database error: ${error.message}`);
		}

		if (error instanceof Prisma.PrismaClientValidationError) {
			console.error('Validation error:', error);
			throw new ArtistError('Invalid data provided');
		}

		// Generic error handling
		console.error('Error fetching artists:', error);
		throw new ArtistError(
			'Unable to retrieve artists. Please try again later.',
			error
		);
	}
}

export type ArtistDetails = Prisma.ArtistGetPayload<{
	include: {
		genres: { include: { genre: true } };
		socialLinks: true;
		articles: { include: { article: true } };
	};
}>;
export async function getArtistsById(id: string): Promise<ArtistDetails> {
	try {
		const data = await prisma.artist.findUnique({
			where: { id },
			include: {
				genres: { include: { genre: true } },
				socialLinks: true,
				articles: { include: { article: true } },
			},
		});

		if (!data) {
			throw new ArtistError('Artist not found');
		}

		return data;
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			// Handle specific Prisma errors
			console.error(`Database error: ${error.code}`, error);
			throw new ArtistError(`Database error: ${error.message}`);
		}

		if (error instanceof Prisma.PrismaClientValidationError) {
			console.error('Validation error:', error);
			throw new ArtistError('Invalid data provided');
		}

		// Generic error handling
		console.error('Error fetching artists:', error);
		throw new ArtistError(
			'Unable to retrieve artists. Please try again later.',
			error
		);
	}
}

export type ArtistList = Prisma.ArtistGetPayload<{
	include: {
		genres: { include: { genre: true } };
		_count: { select: { tracks: true } };
	};
}>;

export async function getArtistsList(limit?: number): Promise<ArtistList[]> {
	try {
		const data = await prisma.artist.findMany({
			orderBy: { tracks: { _count: 'desc' } },
			include: {
				genres: { include: { genre: true } },
				_count: { select: { tracks: true } },
			},
			take: limit,
		});

		return data;
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			// Handle specific Prisma errors
			console.error(`Database error: ${error.code}`, error);
			throw new ArtistError(`Database error: ${error.message}`);
		}

		if (error instanceof Prisma.PrismaClientValidationError) {
			console.error('Validation error:', error);
			throw new ArtistError('Invalid data provided');
		}

		// Generic error handling
		console.error('Error fetching artists:', error);
		throw new ArtistError(
			'Unable to retrieve artists. Please try again later.',
			error
		);
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
