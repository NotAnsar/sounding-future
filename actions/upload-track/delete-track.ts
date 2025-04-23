'use server';

import { prisma } from '@/lib/prisma';
import { DeleteState } from '../utils/utils';
import { deleteFile } from '../utils/s3-image';
import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';
import { auth } from '@/lib/auth';

export async function deleteTrack(id: string): Promise<DeleteState> {
	try {
		// Check if user is admin and if track has multiple artists
		const session = await auth();
		const isAdmin = session?.user?.role === 'admin';

		// Get track details including artists
		const track = await prisma.track.findUnique({
			where: { id },
			include: {
				artists: true,
			},
		});

		if (!track) {
			return { success: false, message: 'Track not found' };
		}

		// Check if non-admin is trying to delete a track with multiple artists
		if (!isAdmin && track.artists.length > 1) {
			return {
				success: false,
				message:
					'You do not have permission to delete tracks with multiple artists. Please contact an admin.',
			};
		}

		// Delete the track
		await prisma.track.delete({ where: { id } });

		// Delete images if they exist
		if (track.cover) await deleteFile(track.cover);
		if (track.variant1) await deleteFile(track.variant1);
		if (track.variant2) await deleteFile(track.variant2);
		if (track.variant3) await deleteFile(track.variant3);

		// No need to delete TrackGenre records here since they will be cascade deleted
		// We should also not need to delete TrackArtist records as they should be configured for cascade delete

		revalidatePath('/', 'layout');
		return { success: true, message: 'Track deleted successfully' };
	} catch (error) {
		console.error('Delete error:', error);

		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			return {
				success: false,
				message: 'Track not found or cannot be deleted',
			};
		}

		return { success: false, message: 'Failed to delete track' };
	}
}
