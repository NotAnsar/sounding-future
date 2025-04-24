'use server';

import { prisma } from '@/lib/prisma';
import { DeleteState } from '../utils/utils';
import { deleteFile } from '../utils/s3-image';
import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';

export async function deleteArtist(id: string): Promise<DeleteState> {
	try {
		// Check if artist has any tracks
		const artistWithTracks = await prisma.artist.findUnique({
			where: { id },
			include: { trackArtists: { include: { track: true } } },
		});

		if (!artistWithTracks) {
			return { success: false, message: 'Artist not found' };
		}

		// If artist has tracks, prevent deletion
		if (artistWithTracks.trackArtists.length > 0) {
			return {
				success: false,
				message:
					'Cannot delete artist with existing tracks. Please delete all tracks first.',
			};
		}

		// Delete related records
		await prisma.$transaction([
			prisma.artistGenre.deleteMany({ where: { artistId: id } }),
			prisma.artistArticle.deleteMany({ where: { artistId: id } }),
			prisma.follow.deleteMany({ where: { followedArtistId: id } }),
		]);

		// Delete the artist
		const artist = await prisma.artist.delete({
			where: { id },
		});

		// Delete artist picture if it exists
		if (artist.pic) {
			await deleteFile(artist.pic);
		}

		revalidatePath('/', 'layout');
		return { success: true, message: 'Artist deleted successfully' };
	} catch (error) {
		console.error('Delete error:', error);

		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			return {
				success: false,
				message: 'Artist not found or cannot be deleted',
			};
		}

		return { success: false, message: 'Failed to delete artist' };
	}
}
