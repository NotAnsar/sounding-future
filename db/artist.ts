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
			orderBy: { trackArtists: { _count: 'desc' } },
		});

		if (random) {
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

export async function getAllArtists(): Promise<ArtistRes> {
	try {
		const data = await prisma.artist.findMany({
			orderBy: { trackArtists: { _count: 'desc' } }, // Changed from tracks to trackArtists
		});

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
			orderBy: { trackArtists: { _count: 'desc' } }, // Changed from tracks to trackArtists
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
				followers: session?.user?.id
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

export type ArtistDetailsStats = Prisma.ArtistGetPayload<{
	include: {
		genres: { include: { genre: true } };
		socialLinks: true;
		user: { select: { f_name: true; l_name: true } };
		articles: { include: { article: true } };
	};
}> & { followed: boolean };

export async function getArtistsById(
	id: string,
	publishedOnly: boolean = true
): Promise<ArtistDetailsStats | undefined> {
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
				user: { select: { f_name: true, l_name: true } },
				followers: session?.user?.id
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

// Define types for the data we work with
type TrackListener = {
	id: string;
	createdAt: Date;
	trackId: string;
	userId: string;
	listenedAt: Date;
};

type Genre = {
	id: string;
	slug: string;
	name: string;
	createdAt: Date;
	displayOrder: number;
};

type ArtistGenre = {
	genre: Genre;
	artistId: string;
	genreId: string;
	createdAt: Date;
};

type SocialLinks = {
	id: string;
	facebook: string | null;
	instagram: string | null;
	linkedin: string | null;
	vimeo: string | null;
	website: string | null;
	youtube: string | null;
	mastodon: string | null;
	createdAt: Date;
};

type TrackWithListeners = {
	id: string;
	title: string;
	slug: string;
	cover: string;
	listeners: TrackListener[];
	// Add any other essential fields required by your app
};

type ArtistCountInfo = {
	trackArtists: number;
	tracks: number;
	followers?: number;
};

// Define the ArtistList type more specifically
export type ArtistList = {
	id: string;
	slug: string;
	name: string;
	f_name: string | null;
	l_name: string | null;
	pic: string | null;
	bio: string | null;
	socialId: string | null;
	createdAt: Date;
	published: boolean;
	genres: ArtistGenre[];
	socialLinks: SocialLinks | null;
	tracks: TrackWithListeners[];
	_count: ArtistCountInfo;
};

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
						trackArtists: true,
					},
				},
				trackArtists: {
					include: {
						track: {
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

		// Transform trackArtists to match the expected tracks structure
		const transformedArtists: ArtistList[] = artists.map((artist) => {
			// Extract tracks from trackArtists
			const tracks = artist.trackArtists.map((ta) => ({
				id: ta.track.id,
				title: ta.track.title,
				slug: ta.track.slug,
				cover: ta.track.cover,
				listeners: ta.track.listeners,
			}));

			// Create a simplified ArtistList object
			return {
				id: artist.id,
				slug: artist.slug,
				name: artist.name,
				f_name: artist.f_name,
				l_name: artist.l_name,
				pic: artist.pic,
				bio: artist.bio,
				socialId: artist.socialId,
				createdAt: artist.createdAt,
				published: artist.published,
				genres: artist.genres,
				socialLinks: artist.socialLinks,
				tracks,
				_count: {
					trackArtists: artist._count.trackArtists,
					tracks: artist._count.trackArtists,
				},
			};
		});

		if (type === 'popular') {
			// Sort by total listeners
			return {
				data: [...transformedArtists].sort((a, b) => {
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
			data: transformedArtists,
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
			include: {
				artist: {
					include: {
						genres: true,
						socialLinks: true,
						_count: { select: { followers: true } },
					},
				},
			},
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
	include: {
		genres: true;
		socialLinks: true;
		_count: { select: { followers: true } };
	};
}>;

// Define the ArtistStats type with more specific types
export type ArtistStats = {
	id: string;
	slug: string;
	name: string;
	f_name: string | null;
	l_name: string | null;
	pic: string | null;
	bio: string | null;
	socialId: string | null;
	createdAt: Date;
	published: boolean;
	genres: ArtistGenre[];
	user: {
		f_name: string | null;
		l_name: string | null;
	} | null;
	played: number;
	liked: number;
	_count: {
		trackArtists: number;
		followers: number;
		tracks: number;
	};
};

type ArtistStatRes = { data: ArtistStats[]; error?: boolean; message?: string };

export async function getArtistsStats(limit?: number): Promise<ArtistStatRes> {
	try {
		const data = await prisma.artist.findMany({
			include: {
				genres: { include: { genre: true } },
				_count: { select: { trackArtists: true, followers: true } },
				user: { select: { f_name: true, l_name: true } },
				trackArtists: {
					select: {
						track: {
							select: {
								_count: { select: { listeners: true, likes: true } },
							},
						},
					},
				},
			},
			orderBy: { createdAt: 'desc' },
			take: limit,
		});

		// Calculate total plays and likes for each artist
		const statsWithPlays: ArtistStats[] = data.map((artist) => {
			// Calculate totals
			const played = artist.trackArtists.reduce(
				(s, ta) => s + ta.track._count.listeners,
				0
			);
			const liked = artist.trackArtists.reduce(
				(sum, ta) => sum + ta.track._count.likes,
				0
			);

			// Create a simplified ArtistStats object
			return {
				id: artist.id,
				slug: artist.slug,
				name: artist.name,
				f_name: artist.f_name,
				l_name: artist.l_name,
				pic: artist.pic,
				bio: artist.bio,
				socialId: artist.socialId,
				createdAt: artist.createdAt,
				published: artist.published,
				genres: artist.genres,
				user: artist.user,
				played,
				liked,
				_count: {
					trackArtists: artist._count.trackArtists,
					followers: artist._count.followers,
					tracks: artist._count.trackArtists,
				},
			};
		});

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

export type FollowWithUser = {
	user: {
		id: string;
		f_name: string | null;
		l_name: string | null;
		image: string | null;
		name: string;
		artist: { slug: string; published: boolean } | null;
	};
};

export const getFollowers = async (
	artistId: string
): Promise<FollowWithUser[]> => {
	const users = await prisma.follow.findMany({
		where: { followedArtistId: artistId },
		include: {
			user: {
				select: {
					id: true,
					f_name: true,
					l_name: true,
					image: true,
					name: true,
					artist: { select: { slug: true, published: true } },
				},
			},
		},
		orderBy: { createdAt: 'desc' },
	});
	return users;
};
