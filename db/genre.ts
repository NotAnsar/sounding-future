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

export type GenreDetails = Prisma.GenreGetPayload<{
	include: {
		tracks: {
			include: {
				track: {
					include: { artist: true; genres: { include: { genre: true } } };
				};
			};
		};
	};
}>;

export async function getGenreDetailsById(id?: string): Promise<GenreDetails> {
	try {
		const genre = await prisma.genre.findUnique({
			where: { id },

			include: {
				tracks: {
					include: {
						track: {
							include: { artist: true, genres: { include: { genre: true } } },
						},
					},
				},
			},
		});

		if (!genre) {
			throw new GenreError(`Genre with ID ${id} not found.`);
		}

		return genre;
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

export const GENRES_GRADIENT = [
	{ from: '#A42F67', to: '#513383' },
	{ from: '#267B43', to: '#2F489F' },
	{ from: '#7F8128', to: '#1F1D7B' },
	{ from: '#f46217', to: '#0b486b' },
	{ from: '#4b1248', to: '#efc27b' },
];
