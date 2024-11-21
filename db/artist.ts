import { prisma } from '@/lib/prisma';
import { Prisma, type Artist } from '@prisma/client';

class ArtistError extends Error {
	constructor(message: string, public readonly cause?: unknown) {
		super(message);
		this.name = 'ArtistError';
	}
}

export async function getArtists(): Promise<Artist[]> {
	try {
		const data = await prisma.artist.findMany({
			orderBy: { createdAt: 'desc' },
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
