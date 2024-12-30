import GenreDetails from '@/components/genres/GenreDetails';
import { prisma } from '@/lib/prisma';
import { Prisma, type Genre } from '@prisma/client';

// class GenreError extends Error {
// 	constructor(message: string, public readonly cause?: unknown) {
// 		super(message);
// 		this.name = 'GenreError';
// 	}
// }

type GenreRes = { data: Genre[]; error?: boolean; message?: string };

export async function getGenres(): Promise<GenreRes> {
	try {
		const genres = await prisma.genre.findMany({
			orderBy: { displayOrder: 'asc' },
		});

		return { data: genres, error: false };
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			// Handle specific Prisma errors
			console.error(`Database error: ${error.code}`, error);
			// throw new GenreError(`Database error: ${error.message}`);
			return {
				data: [],
				error: true,
				message: `Database error: ${error.message}`,
			};
		}

		if (error instanceof Prisma.PrismaClientValidationError) {
			console.error('Validation error:', error);
			// throw new GenreError('Invalid data provided');
			return { data: [], error: true, message: 'Invalid data provided' };
		}

		// Generic error handling
		console.error('Error fetching genres:', error);
		// throw new GenreError(
		// 	'Unable to retrieve genres. Please try again later.',
		// 	error
		// );
		return {
			data: [],
			error: true,
			message: 'Unable to retrieve genres. Please try again later.',
		};
	}
}

export type GenreDetails = Genre;

type GenreDetailsRes = {
	error?: boolean;
	message?: string;
	data: GenreDetails | null;
};

export async function getGenreDetailsById(
	id?: string
): Promise<GenreDetailsRes> {
	try {
		const genre = await prisma.genre.findUnique({
			where: { id },
		});

		if (!genre) {
			return { data: null, error: true, message: 'Genre not found' };
		}

		return { data: genre, error: false };
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			// Handle specific Prisma errors
			console.error(`Database error: ${error.code}`, error);
			// throw new GenreError(`Database error: ${error.message}`);
			return {
				data: null,
				error: true,
				message: `Database error: ${error.message}`,
			};
		}

		if (error instanceof Prisma.PrismaClientValidationError) {
			console.error('Validation error:', error);
			// throw new GenreError('Invalid data provided');
			return { data: null, error: true, message: 'Invalid data provided' };
		}

		// Generic error handling
		console.error('Error fetching genres:', error);
		// throw new GenreError(
		// 	'Unable to retrieve genres. Please try again later.',
		// 	error
		// );
		return {
			data: null,
			error: true,
			message: 'Unable to retrieve genres. Please try again later.',
		};
	}
}

export const GENRES_GRADIENT = [
	{ from: '#A42F67', to: '#513383' },
	{ from: '#267B43', to: '#2F489F' },
	{ from: '#7F8128', to: '#1F1D7B' },
	{ from: '#f46217', to: '#0b486b' },
	{ from: '#4b1248', to: '#efc27b' },
];
