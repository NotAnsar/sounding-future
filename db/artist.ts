import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Prisma, type Artist } from '@prisma/client';
import { AuthenticationError, UserNotFoundError } from './user';

type ArtistRes = { data: Artist[]; error?: boolean; message?: string };

export async function getArtists(
	limit?: number,
	random: boolean = false
): Promise<ArtistRes> {
	try {
		let data = await prisma.artist.findMany({
			where: { published: true },
			orderBy: { tracks: { _count: 'desc' } },
		});

		if (random) {
			// Fisher-Yates shuffle algorithm
			for (let i = data.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[data[i], data[j]] = [data[j], data[i]];
			}
		}

		// Apply limit after shuffle if needed
		if (limit) {
			data = data.slice(0, limit);
		}

		return { data, error: false };
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			// Handle specific Prisma errors
			console.error(`Database error: ${error.code}`, error);

			return { data: [], error: true, message: 'Database error' };
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

export async function getUnlinkedArtists(id?: string): Promise<ArtistRes> {
	try {
		const data = await prisma.artist.findMany({
			where: {
				OR: [{ user: null }, { user: { id } }],
			},
		});

		return { data, error: false };
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			console.error(`Database error: ${error.code}`, error);

			return { data: [], error: true, message: 'Database error' };
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
			return { data: [], error: true, message: `Database error` };
		}

		if (error instanceof Prisma.PrismaClientValidationError) {
			console.error('Validation error:', error);
			// throw new ArtistError('Invalid data provided');
			return { data: [], error: true, message: 'Invalid data provided' };
		}

		// Generic error handling
		console.error('Error fetching artists:', error);

		return { data: [], error: true, message: 'Unable to retrieve artists' };
	}
}

export async function getArtistsBySlug(
	slug: string,
	publishedOnly: boolean = true
): Promise<ArtistDetails | undefined> {
	const session = await auth();
	try {
		const data = await prisma.artist.findUnique({
			where: {
				slug: slug,
				published: publishedOnly ? true : undefined,
			},
			include: {
				genres: { include: { genre: true } },
				socialLinks: true,
				articles: { include: { article: true } },
				followers: session?.user.id
					? { where: { followingUserId: session.user.id } }
					: undefined,
			},
		});

		if (!data) {
			return undefined;
		}

		return {
			...data,
			followed: session?.user ? data.followers.length > 0 : false,
		};
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			console.error(`Database error: ${error.code}`, error);
		}

		if (error instanceof Prisma.PrismaClientValidationError) {
			console.error('Validation error:', error);
		}

		console.error('Error fetching artists:', error);

		return undefined;
	}
}

export type ArtistDetails = Prisma.ArtistGetPayload<{
	include: {
		genres: { include: { genre: true } };
		socialLinks: true;
		articles: { include: { article: true } };
	};
}> & { followed: boolean };

export async function getArtistsById(
	id: string,
	publishedOnly: boolean = true
): Promise<ArtistDetails | undefined> {
	const session = await auth();

	try {
		const data = await prisma.artist.findUnique({
			where: {
				id,
				published: publishedOnly ? true : undefined,
			},
			include: {
				genres: { include: { genre: true } },
				socialLinks: true,
				articles: { include: { article: true } },
				followers: session?.user.id
					? { where: { followingUserId: session.user.id } }
					: undefined,
			},
		});

		if (!data) {
			return undefined;
		}

		return {
			...data,
			followed: session?.user ? data.followers.length > 0 : false,
		};
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			console.error(`Database error: ${error.code}`, error);
		}

		if (error instanceof Prisma.PrismaClientValidationError) {
			console.error('Validation error:', error);
		}

		console.error('Error fetching artists:', error);

		return undefined;
	}
}

export type ArtistList = Prisma.ArtistGetPayload<{
	include: {
		genres: { include: { genre: true } };
		socialLinks: true;
		_count: { select: { tracks: true } };
		tracks: {
			include: {
				listeners: {
					select: {
						id: true;
						createdAt: true;
						trackId: true;
						userId: true;
						listenedAt: true;
					};
				};
			};
		};
	};
}>;

export async function getArtistsList(
	limit?: number,
	type: 'new' | 'popular' | 'default' = 'default'
): Promise<{ data: ArtistList[]; error?: boolean; message?: string }> {
	try {
		const artists = await prisma.artist.findMany({
			where: {
				published: true,
			},
			include: {
				genres: {
					include: {
						genre: true,
					},
				},
				socialLinks: true,
				_count: {
					select: {
						tracks: true,
					},
				},
				tracks: {
					include: {
						listeners: {
							select: {
								id: true,
								createdAt: true,
								trackId: true,
								userId: true,
								listenedAt: true,
							},
						},
					},
				},
			},
			orderBy:
				type === 'new'
					? { createdAt: 'desc' }
					: type === 'default'
					? { name: 'asc' }
					: undefined,
			take: limit,
		});

		if (type === 'popular') {
			// Sort by total listeners while maintaining the original structure
			return {
				data: [...artists].sort((a, b) => {
					const aListeners = a.tracks.reduce(
						(sum, track) => sum + track.listeners.length,
						0
					);
					const bListeners = b.tracks.reduce(
						(sum, track) => sum + track.listeners.length,
						0
					);
					return bListeners - aListeners;
				}),
				error: false,
			};
		}

		return {
			data: artists,
			error: false,
		};
	} catch (error) {
		let message = 'Unable to retrieve artists. Please try again later.';
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			console.error(`Database error: ${error.code}`, error);
			message = `Database error: ${error.code}`;
		}

		if (error instanceof Prisma.PrismaClientValidationError) {
			console.error('Validation error:', error);
			message = 'Invalid data provided';
		}

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
		_count: { select: { tracks: true; followers: true } };
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
			include: {
				genres: { include: { genre: true } },
				_count: { select: { tracks: true, followers: true } },

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
			return { data: [], error: true, message: 'Database error' };
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
