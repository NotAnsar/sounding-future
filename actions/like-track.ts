'use server';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export type LikeState = {
	success?: boolean;
	message: string;
};

export async function likeTrack(trackId: string): Promise<LikeState> {
	const session = await auth();
	if (!session?.user.id) {
		return { success: false, message: 'You must be logged in to like a track' };
	}

	try {
		const existingLike = await prisma.like.findUnique({
			where: { userId_trackId: { userId: session.user.id, trackId: trackId } },
		});

		if (existingLike) {
			// Unlike the track
			await prisma.like.delete({
				where: {
					userId_trackId: { userId: session.user.id, trackId: trackId },
				},
			});
		} else {
			// Like the track
			await prisma.like.create({ data: { trackId, userId: session.user.id } });
		}

		revalidatePath('/');
		return { success: true, message: 'Track like status updated' };
	} catch (error) {
		return { success: false, message: 'Failed to update track like status' };
	}
}

export type LikeWithUser = {
	user: {
		id: string;
		f_name: string | null;
		l_name: string | null;
		image: string | null;
		name: string;
		artist: { slug: string; published: boolean } | null;
	};
};

export const getLikes = async (trackId: string): Promise<LikeWithUser[]> => {
	const users = await prisma.like.findMany({
		where: { trackId },
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

export type ArtistLikeWithUser = {
	user: {
		id: string;
		f_name: string | null;
		l_name: string | null;
		image: string | null;
		name: string;
		artist: { slug: string; published: boolean } | null;
	};
	tracks: { title: string; slug: string }[];
};

export const getArtistLikes = async (
	artistId: string
): Promise<ArtistLikeWithUser[]> => {
	const likes = await prisma.like.findMany({
		where: {
			track: {
				artists: {
					some: {
						artistId: artistId,
					},
				},
			},
		},
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
			track: { select: { title: true, slug: true } },
		},
		orderBy: { createdAt: 'desc' },
	});

	const groupedLikes = likes.reduce((acc, like) => {
		const userId = like.user.id;
		const existingUser = acc.find((item) => item.user.id === userId);

		if (existingUser) {
			existingUser.tracks.push(like.track);
		} else {
			acc.push({
				user: like.user,
				tracks: [like.track],
			});
		}

		return acc;
	}, [] as ArtistLikeWithUser[]);

	return groupedLikes;
};

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
