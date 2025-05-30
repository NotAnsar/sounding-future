'use server';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function updateCourseProgress(
	courseId: string,
	currentChapterId: string
) {
	const session = await auth();
	const userId = session?.user?.id;

	if (!userId) {
		throw new Error('Unauthorized access');
	}

	// Check if all chapters are completed
	const [totalChapters, completedChapters] = await Promise.all([
		prisma.chapter.count({ where: { courseId } }),
		prisma.chapterProgress.count({
			where: { userId, chapter: { courseId }, completed: true },
		}),
	]);

	const isCompleted = completedChapters === totalChapters && totalChapters > 0;

	const courseProgress = await prisma.courseProgress.upsert({
		where: { userId_courseId: { userId, courseId } },
		update: {
			lastAccessedAt: new Date(),
			currentChapterId,
			// Auto-complete if all chapters done
			completedAt: isCompleted ? new Date() : undefined,
		},
		create: {
			userId,
			courseId,
			currentChapterId,
			lastAccessedAt: new Date(),
			startedAt: new Date(),
		},
	});

	return {
		courseProgress,
		isCompleted,
		progressPercentage: (completedChapters / totalChapters) * 100,
	};
}
