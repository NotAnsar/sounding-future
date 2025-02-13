'use server';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export type FollowState = {
	success?: boolean;
	message: string;
};

export async function followArtist(artistId: string): Promise<FollowState> {
	const session = await auth();
	if (!session?.user.id) {
		return {
			success: false,
			message: 'You must be logged in to follow artist',
		};
	}

	try {
		const existingFollow = await prisma.follow.findUnique({
			where: {
				followingUserId_followedArtistId: {
					followedArtistId: artistId,
					followingUserId: session.user.id,
				},
			},
		});

		if (existingFollow) {
			// Unfollow Artist
			await prisma.follow.delete({
				where: {
					followingUserId_followedArtistId: {
						followedArtistId: artistId,
						followingUserId: session.user.id,
					},
				},
			});
		} else {
			// Follow Artist
			await prisma.follow.create({
				data: { followedArtistId: artistId, followingUserId: session.user.id },
			});
		}

		revalidatePath('/');
		return { success: true, message: 'Artist follow status updated' };
	} catch (error) {
		return { success: false, message: 'Failed to update follow status status' };
	}
}
