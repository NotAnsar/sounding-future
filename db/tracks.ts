import { auth } from '@/lib/auth';
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

export type PublicTrack = Prisma.TrackGetPayload<{
	include: {
		artist: true;
		genres: { include: { genre: true } };
	};
}>;

export type PublicTrackWithLikeStatus = PublicTrack & {
	isLiked: boolean;
	_count?: { likes: number };
};

export async function getPublicTracks(
	limit?: number
): Promise<PublicTrackWithLikeStatus[]> {
	const session = await auth();

	try {
		const data = await prisma.track.findMany({
			include: {
				artist: true,
				genres: { include: { genre: true } },
				likes: session?.user.id
					? {
							where: { userId: session.user.id },
					  }
					: false,
				_count: { select: { likes: true } },
			},
			take: limit,
			where: { published: true },
			// orderBy: { releaseYear: 'desc' },
		});

		return data.map((track) => ({
			...track,
			isLiked: session?.user ? track.likes.length > 0 : false,
		}));
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

export async function getPublicTracksByArtist(
	artistId: string,
	limit?: number
): Promise<PublicTrackWithLikeStatus[]> {
	const session = await auth();

	try {
		const data = await prisma.track.findMany({
			include: {
				artist: true,
				genres: { include: { genre: true } },
				likes: session?.user.id
					? {
							where: { userId: session.user.id },
					  }
					: false,
				_count: { select: { likes: true } },
			},
			take: limit,
			where: { artistId, published: true },
			// orderBy: { releaseYear: 'desc' },
		});

		return data.map((track) => ({
			...track,
			isLiked: session?.user ? track.likes.length > 0 : false,
		}));
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

export async function getPublicTrackByGenres(
	genres: string[],
	limit?: number,
	myTrackId?: string
): Promise<PublicTrack[]> {
	try {
		const data = await prisma.track.findMany({
			include: {
				artist: true,
				genres: { include: { genre: true } },
			},
			take: limit,
			where: {
				published: true,
				genres: {
					some: genres.length ? { genre: { id: { in: genres } } } : undefined,
				},
				id: { not: myTrackId },
			},
			orderBy: { releaseYear: 'desc' },
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

export type ArtistDetails = Prisma.ArtistGetPayload<{
	include: { socialLinks: true; articles: { include: { article: true } } };
}>;

export type TrackDetails = Prisma.TrackGetPayload<{
	include: {
		artist: {
			include: { articles: { include: { article: true } }; socialLinks: true };
		};
		genres: { include: { genre: true } };
		curator: true;
	};
}> & { isLiked: boolean };

export async function getPublicTracksById(id: string): Promise<TrackDetails> {
	const session = await auth();

	try {
		const data = await prisma.track.findUnique({
			include: {
				artist: {
					include: {
						articles: { include: { article: true } },
						socialLinks: true,
					},
				},
				genres: { include: { genre: true } },
				curator: true,
				likes: session?.user.id
					? {
							where: { userId: session.user.id },
					  }
					: false,
			},
			where: { id, published: true },
		});

		if (!data) {
			throw new TrackError(`Track with ID ${id} not found.`);
		}

		return {
			...data,
			isLiked: session?.user ? data.likes.length > 0 : false,
		};
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
					include: { genre: true },
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

export type TrackWithCounts = Prisma.TrackGetPayload<{
	include: {
		artist: true;
		genres: true;
		curator: true;
		_count: {
			select: {
				likes: true;
				listeners: true;
			};
		};
	};
}>;

export async function getTracksStats(): Promise<TrackWithCounts[]> {
	const session = await auth();
	const isUser = session?.user.role === 'user';
	const artistId = session?.user?.artistId;
	if (!artistId) {
		throw new TrackError('You need to set up an artist profile first.');
	}

	try {
		const data = await prisma.track.findMany({
			where: { artistId: isUser ? artistId! : undefined },
			include: {
				artist: true,
				genres: true,
				curator: true,
				_count: { select: { likes: true, listeners: true } },
			},
			orderBy: { createdAt: 'desc' },
		});

		return data;
	} catch (error) {
		if (error instanceof TrackError) {
			throw new TrackError(
				'You need to set up an artist profile first. Please visit your profile settings to create one before managing your links.'
			);
		}

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

export async function getMyTracksStats(): Promise<TrackWithCounts[]> {
	try {
		const session = await auth();
		const data = await prisma.track.findMany({
			where: { artistId: session?.user?.artistId || undefined },
			include: {
				artist: true,
				genres: true,
				curator: true,
				_count: { select: { likes: true, listeners: true } },
			},
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

export async function getPublicTracksByPartner(
	partnerId: string,
	limit?: number
): Promise<PublicTrackWithLikeStatus[]> {
	const session = await auth();

	try {
		const data = await prisma.track.findMany({
			include: {
				artist: true,
				genres: { include: { genre: true } },
				likes: session?.user.id
					? {
							where: { userId: session.user.id },
					  }
					: false,
				_count: { select: { likes: true } },
			},
			take: limit,
			where: { curatedBy: partnerId, published: true },
			// orderBy: { releaseYear: 'desc' },
		});

		return data.map((track) => ({
			...track,
			isLiked: session?.user ? track.likes.length > 0 : false,
		}));
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

export async function getPublicTracksByGenre(
	genreId: string,
	limit?: number
): Promise<PublicTrackWithLikeStatus[]> {
	const session = await auth();

	try {
		const data = await prisma.track.findMany({
			include: {
				artist: true,
				genres: { include: { genre: true } },
				likes: session?.user.id
					? {
							where: { userId: session.user.id },
					  }
					: false,
				_count: { select: { likes: true } },
			},
			take: limit,
			where: { genres: { some: { genreId } }, published: true },
			// orderBy: { releaseYear: 'desc' },
		});

		return data.map((track) => ({
			...track,
			isLiked: session?.user ? track.likes.length > 0 : false,
		}));
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
