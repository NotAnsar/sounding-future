import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Genre, Prisma, type Track } from '@prisma/client';

export async function getRandomTracks(
	limit: number = 8
): Promise<PublicTrackWithLikeStatusRes> {
	const session = await auth();

	try {
		// Updated SQL query to use track_artists instead of artist_id
		const trackIds = await prisma.$queryRaw<{ id: string }[]>`
            WITH artists_with_tracks AS (
                SELECT DISTINCT ta.artist_id 
                FROM track_artists ta
                JOIN tracks t ON t.id = ta.track_id
                WHERE t.published = true
            ),
            random_tracks AS (
                SELECT t.id, ta.artist_id, 
                    ROW_NUMBER() OVER (PARTITION BY ta.artist_id ORDER BY RANDOM()) as rn
                FROM tracks t
                JOIN track_artists ta ON t.id = ta.track_id
                WHERE t.published = true
            )
            SELECT rt.id 
            FROM random_tracks rt
            WHERE rt.rn = 1
            ORDER BY RANDOM()
            LIMIT ${limit}
        `;

		// Extract IDs
		const orderedIds = trackIds.map((t) => t.id);

		// Fetch full track data
		const data = await prisma.track.findMany({
			where: { id: { in: orderedIds } },
			include: {
				artists: {
					include: { artist: true },
					orderBy: { order: 'asc' },
				},
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

		// Preserve the random order from the query
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
				artists: {
					include: { artist: true },
					orderBy: { order: 'asc' },
				},
				genres: { include: { genre: true } },
				likes: session?.user?.id
					? {
							where: { userId: session.user.id },
					  }
					: false,
				_count: {
					select: {
						likes: true,
						listeners: true,
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
			console.error(`Database error: ${error.code}`, error);
			message = `Database error`;
		}

		if (error instanceof Prisma.PrismaClientValidationError) {
			console.error('Validation error:', error);
			message = 'Invalid data provided';
		}

		console.error('Error fetching tracks:', error);
		return { data: [], error: true, message };
	}
}

export async function getPublicTracksByArtist(
	artistSlug: string[],
	limit?: number
): Promise<PublicTrackWithLikeStatusRes> {
	const session = await auth();

	try {
		const data = await prisma.track.findMany({
			include: {
				artists: {
					include: { artist: true },
					orderBy: { order: 'asc' },
				},
				genres: { include: { genre: true } },
				likes: session?.user?.id
					? {
							where: { userId: session.user.id },
					  }
					: false,
				_count: { select: { likes: true } },
			},
			take: limit,
			where: {
				artists: {
					some: {
						artist: {
							slug: { in: artistSlug },
						},
					},
				},
				published: true,
			},
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
			console.error(`Database error: ${error.code}`, error);
			message = `Database error`;
		}

		if (error instanceof Prisma.PrismaClientValidationError) {
			console.error('Validation error:', error);
			message = 'Invalid data provided';
		}

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
				artists: {
					include: { artist: true },
					orderBy: { order: 'asc' },
				},
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
			console.error(`Database error: ${error.code}`, error);
			message = `Database error`;
		}

		if (error instanceof Prisma.PrismaClientValidationError) {
			console.error('Validation error:', error);
			message = 'Invalid data provided';
		}

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
				artists: {
					include: {
						artist: {
							include: {
								articles: { include: { article: true } },
								socialLinks: true,
							},
						},
					},
					orderBy: { order: 'asc' },
				},
				genres: { include: { genre: true } },
				curator: true,
				sourceFormat: true,
				likes: session?.user?.id
					? {
							where: { userId: session.user.id },
					  }
					: false,
			},
			where: { slug },
		});

		if (!data) {
			return { data: null, error: true, message: 'Track not found' };
		}

		if (!data.published) {
			return {
				data: null,
				error: true,
				message: 'This track has not been published yet.',
			};
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
			console.error(`Database error: ${error.code}`, error);
			message = `Database error`;
		}

		if (error instanceof Prisma.PrismaClientValidationError) {
			console.error('Validation error:', error);
			message = 'Invalid data provided';
		}

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
				artists: {
					include: { artist: true },
					orderBy: { order: 'asc' },
				},
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
			console.error(`Database error: ${error.code}`, error);
			message = `Database error`;
		}

		if (error instanceof Prisma.PrismaClientValidationError) {
			console.error('Validation error:', error);
			message = 'Invalid data provided';
		}

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
	const isAdmin = session?.user?.role === 'admin';
	const artistId = session?.user?.artistId;

	if (!isAdmin && !artistId) {
		return {
			data: [],
			error: true,
			message: 'You need to set up an artist profile first.',
		};
	}

	try {
		// For admin, get all tracks. For artist, get tracks where they are a collaborator
		const data = await prisma.track.findMany({
			where: isAdmin
				? undefined
				: {
						artists: { some: { artistId: artistId! } },
				  },
			include: {
				artists: {
					include: { artist: true },
					orderBy: { order: 'asc' },
				},
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
			console.error(`Database error: ${error.code}`, error);
			message = `Database error`;
		}

		if (error instanceof Prisma.PrismaClientValidationError) {
			console.error('Validation error:', error);
			message = 'Invalid data provided';
		}

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
				artists: {
					include: { artist: true },
					orderBy: { order: 'asc' },
				},
				genres: { include: { genre: true } },
				likes: session?.user?.id
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
			console.error(`Database error: ${error.code}`, error);
			message = `Database error`;
		}

		if (error instanceof Prisma.PrismaClientValidationError) {
			console.error('Validation error:', error);
			message = 'Invalid data provided';
		}

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
				artists: {
					include: { artist: true },
					orderBy: { order: 'asc' },
				},
				genres: { include: { genre: true } },
				likes: session?.user?.id
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
			console.error(`Database error: ${error.code}`, error);
			message = `Database error`;
		}

		if (error instanceof Prisma.PrismaClientValidationError) {
			console.error('Validation error:', error);
			message = 'Invalid data provided';
		}

		console.error('Error fetching tracks:', error);
		return { data: [], error: true, message };
	}
}

// Updated type definitions to remove artist field references
export type TrackArtistData = Prisma.TrackArtistGetPayload<{
	include: { artist: true };
}>;

export type ArtistDetails = Prisma.ArtistGetPayload<{
	include: { socialLinks: true; articles: { include: { article: true } } };
}>;

export type TrackDetails = Prisma.TrackGetPayload<{
	include: {
		artists: {
			include: {
				artist: {
					include: {
						articles: { include: { article: true } };
						socialLinks: true;
					};
				};
			};
		};
		genres: { include: { genre: true } };
		curator: true;
		sourceFormat: true;
	};
}> & { isLiked: boolean };

export type PublicTrack = Prisma.TrackGetPayload<{
	include: {
		artists: { include: { artist: true } };
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

export type TrackWithgenres = { genres: Genre[] } & Track & {
		artists: TrackArtistData[];
	};

export type TrackWithCounts = Prisma.TrackGetPayload<{
	include: {
		artists: { include: { artist: true } };
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
