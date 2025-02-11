import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Genre, Prisma, type Track } from '@prisma/client';

export async function getNewTracks(): Promise<PublicTrackWithLikeStatusRes> {
	const session = await auth();

	try {
		// Step 1: Get IDs of the latest track per artist (using raw SQL)
		const trackIds = await prisma.$queryRaw<{ id: string }[]>`
      WITH latest_tracks AS (
        SELECT DISTINCT ON (artist_id) id, created_at
        FROM tracks
        WHERE published = true
        ORDER BY artist_id, created_at DESC
      )
      SELECT id FROM latest_tracks
      ORDER BY created_at DESC
      LIMIT 8
    `;

		// Extract IDs in correct order
		const orderedIds = trackIds.map((t) => t.id);

		// Step 2: Fetch full track data for these IDs
		const data = await prisma.track.findMany({
			where: { id: { in: orderedIds } },
			include: {
				artist: true,
				genres: { include: { genre: true } },
				likes: session?.user?.id
					? { where: { userId: session.user.id } }
					: false,
				_count: {
					select: {
						likes: true,
						listeners: true,
					},
				},
			},
		});

		// Re-order tracks to match original ID order
		const orderedData = orderedIds
			.map((id) => data.find((track) => track.id === id))
			.filter((track): track is (typeof data)[0] => track !== undefined);

		return {
			data: orderedData.map((track) => ({
				...track,
				isLiked: session?.user ? track.likes.length > 0 : false,
			})),
			error: false,
		};
	} catch (error) {
		let message = 'Unable to retrieve tracks. Please try again later.';
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			console.error(`Database error: ${error.code}`, error);
			message = `Database error`;
		} else if (error instanceof Prisma.PrismaClientValidationError) {
			console.error('Validation error:', error);
			message = 'Invalid data provided';
		}
		console.error('Error fetching tracks:', error);
		return { data: [], error: true, message };
	}
}

export async function getPublicTracks(
	limit?: number,
	type: 'new' | 'popular' | 'default' = 'default'
): Promise<PublicTrackWithLikeStatusRes> {
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
				_count: {
					select: {
						likes: true,
						listeners: true, // Include listeners count
					},
				},
			},
			take: limit,
			where: { published: true },
			orderBy:
				type === 'popular'
					? { listeners: { _count: 'desc' } }
					: type === 'new'
					? { createdAt: 'desc' }
					: undefined,
		});

		return {
			data: data.map((track) => ({
				...track,
				isLiked: session?.user ? track.likes.length > 0 : false,
			})),
			error: false,
		};
	} catch (error) {
		let message = 'Unable to retrieve tracks. Please try again later.';
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			// Handle specific Prisma errors
			console.error(`Database error: ${error.code}`, error);
			message = `Database error`;
		}

		if (error instanceof Prisma.PrismaClientValidationError) {
			console.error('Validation error:', error);
			message = 'Invalid data provided';
		}

		// Generic error handling
		console.error('Error fetching tracks:', error);
		return { data: [], error: true, message };
	}
}

export async function getPublicTracksByArtist(
	artistSlug: string,
	limit?: number
): Promise<PublicTrackWithLikeStatusRes> {
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
			where: { artist: { slug: artistSlug }, published: true },
			orderBy: { releaseYear: 'desc' },
		});

		return {
			data: data.map((track) => ({
				...track,
				isLiked: session?.user ? track.likes.length > 0 : false,
			})),
			error: false,
		};
	} catch (error) {
		let message = 'Unable to retrieve tracks. Please try again later.';
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			// Handle specific Prisma errors
			console.error(`Database error: ${error.code}`, error);
			message = `Database error`;
		}

		if (error instanceof Prisma.PrismaClientValidationError) {
			console.error('Validation error:', error);
			message = 'Invalid data provided';
		}

		// Generic error handling
		console.error('Error fetching tracks:', error);
		return { data: [], error: true, message };
	}
}

export async function getArtistSimilarTracks(
	genres: string[],
	type: 'new' | 'popular' | 'default' = 'default',
	limit?: number,
	myTrackId?: string
): Promise<{ data: PublicTrack[]; error?: boolean; message?: string }> {
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
			orderBy:
				type === 'popular'
					? { listeners: { _count: 'desc' } }
					: type === 'new'
					? { releaseYear: 'desc' }
					: undefined,
		});

		return { data, error: false };
	} catch (error) {
		let message = 'Unable to retrieve tracks. Please try again later.';
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			// Handle specific Prisma errors
			console.error(`Database error: ${error.code}`, error);
			message = `Database error`;
		}

		if (error instanceof Prisma.PrismaClientValidationError) {
			console.error('Validation error:', error);
			message = 'Invalid data provided';
		}

		// Generic error handling
		console.error('Error fetching tracks:', error);
		return { data: [], error: true, message };
	}
}

export async function getPublicTracksById(
	slug: string
): Promise<{ data: TrackDetails | null; error?: boolean; message?: string }> {
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
				sourceFormat: true,
				likes: session?.user.id
					? {
							where: { userId: session.user.id },
					  }
					: false,
			},
			where: { slug, published: true },
		});

		if (!data) {
			return { data: null, error: true, message: 'Track not found' };
		}

		return {
			data: {
				...data,
				isLiked: session?.user ? data.likes.length > 0 : false,
			},
			error: false,
		};
	} catch (error) {
		let message = 'Unable to retrieve track. Please try again later.';
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			// Handle specific Prisma errors
			console.error(`Database error: ${error.code}`, error);
			message = `Database error`;
		}

		if (error instanceof Prisma.PrismaClientValidationError) {
			console.error('Validation error:', error);
			message = 'Invalid data provided';
		}

		// Generic error handling
		console.error('Error fetching tracks:', error);
		return { data: null, error: true, message };
	}
}

export async function getTrackById(id: string): Promise<{
	data: TrackWithgenres | undefined;
	error?: boolean;
	message?: string;
}> {
	try {
		const data = await prisma.track.findUnique({
			where: { id },

			include: {
				genres: {
					include: { genre: true },
				},
			},
		});

		if (!data) {
			return { data: undefined, error: true, message: 'Track not found' };
		}

		// Transform data to match expected return type
		const transformedData = {
			...data,
			genres: data.genres.map((trackGenre) => trackGenre.genre),
		};

		return { data: transformedData, error: false };
	} catch (error) {
		let message = 'Unable to retrieve track. Please try again later.';
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			// Handle specific Prisma errors
			console.error(`Database error: ${error.code}`, error);
			message = `Database error`;
		}

		if (error instanceof Prisma.PrismaClientValidationError) {
			console.error('Validation error:', error);
			message = 'Invalid data provided';
		}

		// Generic error handling
		console.error('Error fetching tracks:', error);
		return { data: undefined, error: true, message };
	}
}

export async function getTracksStats(): Promise<{
	data: TrackWithCounts[];
	error?: boolean;
	message?: string;
}> {
	const session = await auth();
	const isUser = session?.user.role === 'user';
	const artistId = session?.user?.artistId;
	if (isUser && !artistId) {
		return {
			data: [],
			error: true,
			message: 'You need to set up an artist profile first.',
		};
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

		return { data, error: false };
	} catch (error) {
		let message = 'Unable to retrieve tracks. Please try again later.';

		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			// Handle specific Prisma errors
			console.error(`Database error: ${error.code}`, error);
			message = `Database error`;
		}

		if (error instanceof Prisma.PrismaClientValidationError) {
			console.error('Validation error:', error);
			message = 'Invalid data provided';
		}

		// Generic error handling
		console.error('Error fetching tracks:', error);
		return { data: [], error: true, message };
	}
}

export async function getPublicTracksByPartner(
	partnerSlug: string,
	type: 'new' | 'popular' | 'default' = 'default',
	limit?: number
): Promise<PublicTrackWithLikeStatusRes> {
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
				curator: true,
			},
			take: limit,
			where: {
				curator: { slug: partnerSlug },
				published: true,
			},
			orderBy:
				type === 'popular'
					? { listeners: { _count: 'desc' } }
					: type === 'new'
					? { releaseYear: 'desc' }
					: undefined,
		});

		return {
			data: data.map((track) => ({
				...track,
				isLiked: session?.user ? track.likes.length > 0 : false,
			})),
			error: false,
		};
	} catch (error) {
		let message = 'Unable to retrieve tracks. Please try again later.';
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			// Handle specific Prisma errors
			console.error(`Database error: ${error.code}`, error);
			message = `Database error`;
		}

		if (error instanceof Prisma.PrismaClientValidationError) {
			console.error('Validation error:', error);
			message = 'Invalid data provided';
		}

		// Generic error handling
		console.error('Error fetching tracks:', error);
		return { data: [], error: true, message };
	}
}

export async function getPublicTracksByGenre(
	genreSlug: string,
	type: 'new' | 'popular' | 'default' = 'default',
	limit?: number
): Promise<PublicTrackWithLikeStatusRes> {
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
			where: {
				genres: { some: { genre: { slug: genreSlug } } },
				published: true,
			},
			orderBy:
				type === 'popular'
					? { listeners: { _count: 'desc' } }
					: type === 'new'
					? { releaseYear: 'desc' }
					: undefined,
		});

		return {
			data: data.map((track) => ({
				...track,
				isLiked: session?.user ? track.likes.length > 0 : false,
			})),
			error: false,
		};
	} catch (error) {
		let message = 'Unable to retrieve tracks. Please try again later.';
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			// Handle specific Prisma errors
			console.error(`Database error: ${error.code}`, error);
			message = `Database error`;
		}

		if (error instanceof Prisma.PrismaClientValidationError) {
			console.error('Validation error:', error);
			message = 'Invalid data provided';
		}

		// Generic error handling
		console.error('Error fetching tracks:', error);
		return { data: [], error: true, message };
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
		sourceFormat: true;
	};
}> & { isLiked: boolean };

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

export type PublicTrackWithLikeStatusRes = {
	data: PublicTrackWithLikeStatus[];
	error?: boolean;
	message?: string;
};

export type TrackWithgenres = { genres: Genre[] } & Track;

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
