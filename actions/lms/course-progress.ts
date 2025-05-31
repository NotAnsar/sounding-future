// 'use server';

// import { auth } from '@/lib/auth';
// import { prisma } from '@/lib/prisma';
// import { revalidatePath } from 'next/cache';

// export async function updateCourseProgress(
// 	courseId: string,
// 	currentChapterId: string
// ) {
// 	try {
// 		const session = await auth();
// 		if (!session?.user?.id) {
// 			throw new Error('Not authenticated');
// 		}

// 		// Upsert course progress
// 		const courseProgress = await prisma.courseProgress.upsert({
// 			where: {
// 				userId_courseId: {
// 					userId: session.user.id,
// 					courseId: courseId,
// 				},
// 			},
// 			update: {
// 				currentChapterId,
// 				lastAccessedAt: new Date(),
// 				updatedAt: new Date(),
// 			},
// 			create: {
// 				userId: session.user.id,
// 				courseId: courseId,
// 				currentChapterId,
// 				startedAt: new Date(),
// 				lastAccessedAt: new Date(),
// 			},
// 		});

// 		return { success: true, progress: courseProgress };
// 	} catch (error) {
// 		console.error('Error updating course progress:', error);
// 		return { success: false, error: 'Failed to update course progress' };
// 	}
// }

// export async function updateChapterProgress(
// 	chapterId: string,
// 	completed: boolean = false,
// 	lastPosition?: number
// ) {
// 	try {
// 		const session = await auth();
// 		if (!session?.user?.id) {
// 			throw new Error('Not authenticated');
// 		}

// 		// Check if chapter progress already exists
// 		const existingProgress = await prisma.chapterProgress.findUnique({
// 			where: {
// 				userId_chapterId: {
// 					userId: session.user.id,
// 					chapterId: chapterId,
// 				},
// 			},
// 		});

// 		// If it already exists and is completed, don't override completion status unless explicitly setting to completed
// 		const shouldMarkCompleted =
// 			completed || (existingProgress?.completed ?? false);

// 		// Prepare update data

// 		const updateData: {
// 			completed: boolean;
// 			updatedAt: Date;
// 			lastPosition?: number;
// 		} = {
// 			completed: shouldMarkCompleted,
// 			updatedAt: new Date(),
// 		};

// 		// Only update lastPosition if provided
// 		if (lastPosition !== undefined) {
// 			updateData.lastPosition = Math.floor(lastPosition);
// 		}

// 		// Upsert chapter progress
// 		const chapterProgress = await prisma.chapterProgress.upsert({
// 			where: {
// 				userId_chapterId: {
// 					userId: session.user.id,
// 					chapterId: chapterId,
// 				},
// 			},
// 			update: updateData,
// 			create: {
// 				userId: session.user.id,
// 				chapterId: chapterId,
// 				lastPosition: lastPosition ? Math.floor(lastPosition) : 0,
// 				completed: completed,
// 			},
// 		});

// 		// If chapter was just completed, check if course should be marked as completed
// 		if (completed) {
// 			// Get the course ID for this chapter
// 			const chapter = await prisma.chapter.findUnique({
// 				where: { id: chapterId, published: true },
// 				select: { courseId: true },
// 			});

// 			if (chapter) {
// 				// Get total chapters and completed chapters for this course
// 				const [totalChapters, completedChapters] = await Promise.all([
// 					prisma.chapter.count({
// 						where: { courseId: chapter.courseId, published: true },
// 					}),
// 					prisma.chapterProgress.count({
// 						where: {
// 							userId: session.user.id,
// 							chapter: { courseId: chapter.courseId },
// 							completed: true,
// 						},
// 					}),
// 				]);

// 				// If all chapters are completed, mark course as completed
// 				if (completedChapters === totalChapters && totalChapters > 0) {
// 					await prisma.courseProgress.update({
// 						where: {
// 							userId_courseId: {
// 								userId: session.user.id,
// 								courseId: chapter.courseId,
// 							},
// 						},
// 						data: {
// 							completedAt: new Date(),
// 							updatedAt: new Date(),
// 						},
// 					});

// 					console.info(
// 						`Course ${chapter.courseId} marked as completed for user ${session.user.id}`
// 					);
// 					revalidatePath(`/courses/${chapter.courseId}`);
// 				}
// 			}
// 		}

// 		return { success: true, progress: chapterProgress };
// 	} catch (error) {
// 		console.error('Error updating chapter progress:', error);
// 		return { success: false, error: 'Failed to update chapter progress' };
// 	}
// }

'use server';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateCourseProgress(
	courseId: string,
	currentChapterId: string
) {
	try {
		const session = await auth();
		if (!session?.user?.id) {
			throw new Error('Not authenticated');
		}

		// NEW: Check if the current chapter is completed
		const currentChapterProgress = await prisma.chapterProgress.findUnique({
			where: {
				userId_chapterId: {
					userId: session.user.id,
					chapterId: currentChapterId,
				},
			},
		});

		let targetChapterId = currentChapterId;

		// NEW: If current chapter is completed, find the next incomplete published chapter
		if (currentChapterProgress?.completed) {
			// Get all published chapters for this course in order
			const publishedChapters = await prisma.chapter.findMany({
				where: {
					courseId: courseId,
					published: true,
				},
				orderBy: { position: 'asc' },
				select: { id: true, position: true },
			});

			// Get all completed chapters for this user in this course
			const completedChapterIds = await prisma.chapterProgress
				.findMany({
					where: {
						userId: session.user.id,
						chapter: { courseId: courseId, published: true },
						completed: true,
					},
					select: { chapterId: true },
				})
				.then((chapters) => chapters.map((ch) => ch.chapterId));

			// Find the first incomplete chapter
			const nextIncompleteChapter = publishedChapters.find(
				(chapter) => !completedChapterIds.includes(chapter.id)
			);

			// If there's an incomplete chapter, use it as target
			if (nextIncompleteChapter) {
				targetChapterId = nextIncompleteChapter.id;
			}
		}

		// Upsert course progress with the determined target chapter
		const courseProgress = await prisma.courseProgress.upsert({
			where: {
				userId_courseId: {
					userId: session.user.id,
					courseId: courseId,
				},
			},
			update: {
				currentChapterId: targetChapterId, // Use target chapter (could be next incomplete or current)
				lastAccessedAt: new Date(),
				updatedAt: new Date(),
			},
			create: {
				userId: session.user.id,
				courseId: courseId,
				currentChapterId: targetChapterId,
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

					console.info(
						`Course ${chapter.courseId} marked as completed for user ${session.user.id}`
					);
					revalidatePath(`/courses/${chapter.courseId}`);
				}
			}
		}

		return { success: true, progress: chapterProgress };
	} catch (error) {
		console.error('Error updating chapter progress:', error);
		return { success: false, error: 'Failed to update chapter progress' };
	}
}

export async function getCourseProgress(courseId: string) {
	try {
		const session = await auth();
		if (!session?.user?.id) {
			return {
				success: false,
				progress: null,
				completedChapters: [],
				completionPercentage: 0,
				totalChapters: 0,
				completedCount: 0,
				currentChapter: null,
			};
		}

		// Get course progress
		const courseProgress = await prisma.courseProgress.findUnique({
			where: {
				userId_courseId: {
					userId: session.user.id,
					courseId: courseId,
				},
			},
		});

		// Get all completed chapters for this course
		const completedChapters = await prisma.chapterProgress.findMany({
			where: {
				userId: session.user.id,
				chapter: {
					courseId: courseId,
					published: true,
				},
				completed: true,
			},
			select: {
				chapterId: true,
			},
		});

		// Get total published chapters count
		const totalChapters = await prisma.chapter.count({
			where: {
				courseId: courseId,
				published: true,
			},
		});

		const completionPercentage =
			totalChapters > 0
				? Math.round((completedChapters.length / totalChapters) * 100)
				: 0;

		return {
			success: true,
			progress: courseProgress,
			completedChapters: completedChapters.map((cp) => cp.chapterId),
			completionPercentage,
			totalChapters,
			completedCount: completedChapters.length,
			currentChapter: courseProgress?.currentChapterId || null,
		};
	} catch (error) {
		console.error('Error getting course progress:', error);
		return {
			success: false,
			progress: null,
			completedChapters: [],
			completionPercentage: 0,
			totalChapters: 0,
			completedCount: 0,
			currentChapter: null,
		};
	}
}
