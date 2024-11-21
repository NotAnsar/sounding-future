import { prisma } from '@/lib/prisma';
import { Genre, Prisma, type Track } from '@prisma/client';

class TrackError extends Error {
	constructor(message: string, public readonly cause?: unknown) {
		super(message);
		this.name = 'TrackError';
	}
}

export async function getTracks(): Promise<Track[]> {
	try {
		const data = await prisma.track.findMany({
			orderBy: { createdAt: 'desc' },
		});

		return data;
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			// Handle specific Prisma errors
			console.error(`Database error: ${error.code}`, error);
			throw new TrackError(`Database error: ${error.message}`);
		}

		if (error instanceof Prisma.PrismaClientValidationError) {
			console.error('Validation error:', error);
			throw new TrackError('Invalid data provided');
		}

		// Generic error handling
		console.error('Error fetching tracks:', error);
		throw new TrackError(
			'Unable to retrieve tracks. Please try again later.',
			error
		);
	}
}

export type TrackWithgenres = { genres: Genre[] } & Track;

export async function getTrackById(id: string): Promise<TrackWithgenres> {
	try {
		const data = await prisma.track.findUnique({
			where: { id },
			// include: { genres: true },
			include: {
				genres: {
					include: {
						genre: true,
					},
				},
			},
		});

		if (!data) {
			throw new TrackError(`Track with ID ${id} not found.`);
		}

		// Transform data to match expected return type
		const transformedData = {
			...data,
			genres: data.genres.map((trackGenre) => trackGenre.genre),
		};

		return transformedData;
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			// Handle specific Prisma errors
			console.error(`Database error: ${error.code}`, error);
			throw new TrackError(`Database error: ${error.message}`);
		}

		if (error instanceof Prisma.PrismaClientValidationError) {
			console.error('Validation error:', error);
			throw new TrackError('Invalid data provided');
		}

		// Generic error handling
		console.error('Error fetching tracks:', error);
		throw new TrackError(
			'Unable to retrieve tracks. Please try again later.',
			error
		);
	}
}
// type Trackwithgenres:{ genres: Genre[] } & Track
