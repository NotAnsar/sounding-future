import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { PublicTrackWithLikeStatusRes } from './tracks';
import { ArtistList } from './artist';

export async function getLikedTracks(): Promise<PublicTrackWithLikeStatusRes> {
	const session = await auth();

	if (!session?.user?.id) {
		return { data: [], error: true, message: 'Authentication required' };
	}

	try {
		const likes = await prisma.like.findMany({
			where: {
				userId: session.user.id,
				track: { published: true },
			},
			include: {
				track: {
					include: {
						artist: true,
						artists: { include: { artist: true }, orderBy: { order: 'asc' } },
						genres: { include: { genre: true } },
						likes: {
							where: { userId: session.user.id },
						},
						_count: {
							select: {
								likes: true, // Total likes count
								listeners: true,
							},
						},
					},
				},
			},
		});

		// Extract tracks from likes and ensure they exist
		const tracks = likes
			.map((like) => like.track)
			.filter((track) => track !== null);

		return {
			data: tracks.map((track) => ({
				...track,
				isLiked: track.likes.length > 0, // Always true due to query filter
			})),
			error: false,
		};
	} catch (error) {
		let message = 'Unable to retrieve liked tracks. Please try again later.';
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			console.error(`Database error: ${error.code}`, error);
			message = `Database error`;
		} else if (error instanceof Prisma.PrismaClientValidationError) {
			console.error('Validation error:', error);
			message = 'Invalid data provided';
		}
		console.error('Error fetching liked tracks:', error);
		return { data: [], error: true, message };
	}
}

export async function getFollowingArtists(): Promise<{
	data: ArtistList[];
	error: boolean;
	message?: string;
}> {
	const session = await auth();

	if (!session?.user?.id) {
		return { data: [], error: true, message: 'Authentication required' };
	}

	try {
		const follows = await prisma.follow.findMany({
			where: {
				followingUserId: session.user.id,
				artist: { published: true },
			},
			include: {
				artist: {
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
				},
			},
		});

		// Extract artists from follows and ensure they exist
		const artists = follows
			.map((follow) => follow.artist)
			.filter((artist): artist is ArtistList => artist !== null);

		return {
			data: artists,
			error: false,
		};
	} catch (error) {
		let message =
			'Unable to retrieve following artists. Please try again later.';
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			console.error(`Database error: ${error.code}`, error);
			message = `Database error`;
		} else if (error instanceof Prisma.PrismaClientValidationError) {
			console.error('Validation error:', error);
			message = 'Invalid data provided';
		}
		console.error('Error fetching following artists:', error);
		return { data: [], error: true, message };
	}
}
