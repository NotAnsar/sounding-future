import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { PublicTrackWithLikeStatusRes } from './tracks';

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
