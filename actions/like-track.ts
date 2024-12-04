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
