'use server';

import { prisma } from '@/lib/prisma';
import { DeleteState } from '../utils/utils';
import { deleteImage } from '../utils/s3-image';
import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';

export async function deleteTrack(id: string): Promise<DeleteState> {
	try {
		const track = await prisma.track.delete({ where: { id } });

		if (!track) {
			return { success: false, message: 'Track not found' };
		}

		// Delete images if they exist
		if (track.cover) await deleteImage(track.cover);
		if (track.variant1) await deleteImage(track.variant1);
		if (track.variant2) await deleteImage(track.variant2);
		if (track.variant3) await deleteImage(track.variant3);

		await prisma.trackGenre.deleteMany({
			where: { trackId: id },
		});

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
