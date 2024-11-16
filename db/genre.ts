import { prisma } from '@/lib/prisma';
import { Prisma, type Genre } from '@prisma/client';

class GenreError extends Error {
	constructor(message: string, public readonly cause?: unknown) {
		super(message);
		this.name = 'GenreError';
	}
}

export async function getGenres(): Promise<Genre[]> {
	try {
		const genres = await prisma.genre.findMany({
			orderBy: { createdAt: 'desc' },
		});

		return genres;
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			// Handle specific Prisma errors
			console.error(`Database error: ${error.code}`, error);
			throw new GenreError(`Database error: ${error.message}`);
		}

		if (error instanceof Prisma.PrismaClientValidationError) {
			console.error('Validation error:', error);
			throw new GenreError('Invalid data provided');
		}

		// Generic error handling
		console.error('Error fetching genres:', error);
		throw new GenreError(
			'Unable to retrieve genres. Please try again later.',
			error
		);
	}
}
