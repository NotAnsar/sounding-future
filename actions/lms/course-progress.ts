'use server';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function updateCourseProgress(
	courseId: string,
	currentChapterId: string
) {
	try {
		const session = await auth();
		if (!session?.user?.id) {
			throw new Error('Not authenticated');
		}

		// Upsert course progress
		const courseProgress = await prisma.courseProgress.upsert({
			where: {
				userId_courseId: {
					userId: session.user.id,
					courseId: courseId,
				},
			},
			update: {
				currentChapterId,
				lastAccessedAt: new Date(),
				updatedAt: new Date(),
			},
			create: {
				userId: session.user.id,
				courseId: courseId,
				currentChapterId,
				startedAt: new Date(),
				lastAccessedAt: new Date(),
			},
		});

		return { success: true, progress: courseProgress };
	} catch (error) {
		console.error('Error updating course progress:', error);
		return { success: false, error: 'Failed to update course progress' };
	}
}

export async function updateChapterProgress(
	chapterId: string,
	completed: boolean = false,
	lastPosition?: number
) {
	try {
		const session = await auth();
		if (!session?.user?.id) {
			throw new Error('Not authenticated');
		}

		// Check if chapter progress already exists
		const existingProgress = await prisma.chapterProgress.findUnique({
			where: {
				userId_chapterId: {
					userId: session.user.id,
					chapterId: chapterId,
				},
			},
		});

		// If it already exists and is completed, don't override completion status unless explicitly setting to completed
		const shouldMarkCompleted =
			completed || (existingProgress?.completed ?? false);

		// Prepare update data

		const updateData: {
			completed: boolean;
			updatedAt: Date;
			lastPosition?: number;
		} = {
			completed: shouldMarkCompleted,
			updatedAt: new Date(),
		};

		// Only update lastPosition if provided
		if (lastPosition !== undefined) {
			updateData.lastPosition = Math.floor(lastPosition);
		}

		// Upsert chapter progress
		const chapterProgress = await prisma.chapterProgress.upsert({
			where: {
				userId_chapterId: {
					userId: session.user.id,
					chapterId: chapterId,
				},
			},
			update: updateData,
			create: {
				userId: session.user.id,
				chapterId: chapterId,
				lastPosition: lastPosition ? Math.floor(lastPosition) : 0,
				completed: completed,
			},
		});

		// If chapter was just completed, check if course should be marked as completed
		if (completed) {
			// Get the course ID for this chapter
			const chapter = await prisma.chapter.findUnique({
				where: { id: chapterId, published: true },
				select: { courseId: true },
			});

			if (chapter) {
				// Get total chapters and completed chapters for this course
				const [totalChapters, completedChapters] = await Promise.all([
					prisma.chapter.count({
						where: { courseId: chapter.courseId, published: true },
					}),
					prisma.chapterProgress.count({
						where: {
							userId: session.user.id,
							chapter: { courseId: chapter.courseId },
							completed: true,
						},
					}),
				]);

				// If all chapters are completed, mark course as completed
				if (completedChapters === totalChapters && totalChapters > 0) {
					await prisma.courseProgress.update({
						where: {
							userId_courseId: {
								userId: session.user.id,
								courseId: chapter.courseId,
							},
						},
						data: {
							completedAt: new Date(),
							updatedAt: new Date(),
						},
					});

					console.log(
						`Course ${chapter.courseId} marked as completed for user ${session.user.id}`
					);
				}
			}
		}

		return { success: true, progress: chapterProgress };
	} catch (error) {
		console.error('Error updating chapter progress:', error);
		return { success: false, error: 'Failed to update chapter progress' };
	}
}
