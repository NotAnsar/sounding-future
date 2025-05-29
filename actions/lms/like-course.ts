'use server';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export type LikeCourseState = {
	success?: boolean;
	message: string;
};

export async function likeCourse(courseId: string): Promise<LikeCourseState> {
	const session = await auth();
	if (!session?.user.id) {
		return {
			success: false,
			message: 'You must be logged in to like a course',
		};
	}

	try {
		const existingLike = await prisma.courseLike.findUnique({
			where: {
				userId_courseId: { userId: session.user.id, courseId: courseId },
			},
		});

		if (existingLike) {
			// Unlike the course
			await prisma.courseLike.delete({
				where: {
					userId_courseId: { userId: session.user.id, courseId: courseId },
				},
			});
		} else {
			// Like the course
			await prisma.courseLike.create({
				data: { courseId, userId: session.user.id },
			});
		}

		revalidatePath('/');
		return { success: true, message: 'Course like status updated' };
	} catch (error) {
		console.error('Error updating course like status:', error);
		return { success: false, message: 'Failed to update course like status' };
	}
}
