import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export type CourseWithRelations = Prisma.CourseGetPayload<{
	include: {
		instructors: { include: { instructor: true } };
		series: true;
		topics: { include: { topic: true } };
		chapters: true;
		_count: { select: { courseProgress: true } };
	};
}>;

export async function getCourses(published?: boolean): Promise<{
	data: CourseWithRelations[];
	error?: boolean;
	message?: string;
}> {
	try {
		const courses = await prisma.course.findMany({
			include: {
				instructors: { include: { instructor: true } },
				series: true,
				topics: { include: { topic: true } },
				chapters: {
					where: published ? { published: published } : undefined,
					orderBy: { position: 'asc' },
				},
				_count: { select: { courseProgress: true } },
			},
			where: published ? { published: published } : undefined,
			orderBy: { createdAt: 'desc' },
		});

		return { data: courses, error: false };
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			console.error(`Database error: ${error.code}`, error);
			return {
				data: [],
				error: true,
				message: `Database error`,
			};
		}

		console.error('Error fetching courses:', error);
		return {
			data: [],
			error: true,
			message: 'Unable to retrieve courses. Please try again later.',
		};
	}
}

export async function getCourseById(id: string): Promise<{
	data: CourseWithRelations | null;
	error?: boolean;
	message?: string;
}> {
	try {
		const course = await prisma.course.findUnique({
			where: { id },
			include: {
				instructors: { include: { instructor: true } },
				series: true,
				topics: { include: { topic: true } },
				chapters: { orderBy: { position: 'asc' } },
				_count: { select: { courseProgress: true } },
			},
		});

		if (!course) {
			return { data: null, error: true, message: 'Course not found' };
		}

		return { data: course, error: false };
	} catch (error) {
		console.error('Error fetching course:', error);
		return {
			data: null,
			error: true,
			message: 'Unable to retrieve course. Please try again later.',
		};
	}
}

export type CourseDetails = Prisma.CourseGetPayload<{
	include: {
		instructors: {
			include: {
				instructor: { include: { courses: { include: { course: true } } } };
			};
		};
		series: true;
		topics: { include: { topic: true } };
		chapters: true;
		_count: { select: { courseProgress: true } };
	};
}>;

export async function getCourseBySlug(slug: string): Promise<{
	data: (CourseDetails & { isLiked?: boolean }) | null;
	error?: boolean;
	message?: string;
}> {
	const session = await auth();

	try {
		const course = await prisma.course.findUnique({
			where: { slug },
			include: {
				instructors: {
					include: {
						instructor: { include: { courses: { include: { course: true } } } },
					},
				},
				series: true,
				topics: { include: { topic: true } },
				chapters: { where: { published: true }, orderBy: { position: 'asc' } },
				_count: { select: { courseProgress: true } },
				likes: session?.user?.id
					? {
							where: { userId: session.user.id },
					  }
					: false,
			},
		});

		if (!course) {
			return { data: null, error: true, message: 'Course not found' };
		}

		return {
			data: {
				...course,
				isLiked: session?.user ? course.likes.length > 0 : false,
			},
			error: false,
		};
	} catch (error) {
		console.error('Error fetching course:', error);
		return {
			data: null,
			error: true,
			message: 'Unable to retrieve course. Please try again later.',
		};
	}
}

export async function getUserFavoriteCoursesWithDetails(
	userId?: string
): Promise<{
	data: (CourseDetails & {
		isLiked: boolean;
		likeCount: number;
		currentChapterSlug?: string;
	})[];
	error?: boolean;
	message?: string;
}> {
	const session = await auth();
	const targetUserId = userId || session?.user?.id;

	if (!targetUserId) {
		return {
			data: [],
			error: true,
			message: 'User not authenticated',
		};
	}

	try {
		const courses = await prisma.course.findMany({
			where: {
				published: true,
				likes: {
					some: {
						userId: targetUserId,
					},
				},
			},
			include: {
				instructors: {
					include: {
						instructor: { include: { courses: { include: { course: true } } } },
					},
				},
				series: true,
				topics: { include: { topic: true } },
				chapters: { where: { published: true }, orderBy: { position: 'asc' } },
				_count: { select: { courseProgress: true } },
				likes: true,
			},
			orderBy: { createdAt: 'desc' },
		});

		// Get user's current chapter progress for these courses
		const userProgress = await prisma.courseProgress.findMany({
			where: {
				userId: targetUserId,
				courseId: { in: courses.map((c) => c.id) },
			},
			select: {
				courseId: true,
				currentChapterId: true,
			},
		});

		const coursesWithLikeInfo = courses.map((course) => {
			const progress = userProgress.find((p) => p.courseId === course.id);
			let currentChapterSlug;

			if (progress?.currentChapterId) {
				const currentChapter = course.chapters.find(
					(ch) => ch.id === progress.currentChapterId
				);
				currentChapterSlug = currentChapter?.slug;
			}

			return {
				...course,
				isLiked: true,
				likeCount: course.likes.length,
				currentChapterSlug,
			};
		});

		return { data: coursesWithLikeInfo, error: false };
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			console.error(`Database error: ${error.code}`, error);
			return {
				data: [],
				error: true,
				message: `Database error`,
			};
		}

		console.error('Error fetching favorite courses with details:', error);
		return {
			data: [],
			error: true,
			message: 'Unable to retrieve favorite courses. Please try again later.',
		};
	}
}

export async function checkUserAccess() {
	const session = await auth();

	if (!session?.user) {
		return {
			isAuthenticated: false,
			isAdmin: false,
			isPro: false,
			canAccessPro: false,
		};
	}

	const userRole = session?.user.role;
	const isPro = userRole === 'pro';
	const isAdmin = userRole === 'admin';

	return {
		isAuthenticated: true,
		isAdmin,
		isPro,
		canAccessPro: isAdmin || isPro,
	};
}

export async function getCourseProgress(courseId: string) {
	try {
		const session = await auth();
		const userId = session?.user?.id;
		if (!userId) {
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
				userId_courseId: { userId, courseId: courseId },
			},
		});

		// Get all completed chapters for this course
		const completedChapters = await prisma.chapterProgress.findMany({
			where: {
				userId,
				chapter: { courseId: courseId, published: true },
				completed: true,
			},
			select: { chapterId: true },
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

		// NEW: Smart current chapter logic - only move forward, never backward
		let currentChapter = courseProgress?.currentChapterId || null;

		if (currentChapter) {
			// Check if current chapter is completed
			const isCurrentChapterCompleted = completedChapters.some(
				(cp) => cp.chapterId === currentChapter
			);

			if (isCurrentChapterCompleted) {
				// Get all published chapters in order
				const publishedChapters = await prisma.chapter.findMany({
					where: {
						courseId: courseId,
						published: true,
					},
					orderBy: { position: 'asc' },
					select: { id: true, position: true },
				});

				// Find current chapter position
				const currentChapterData = publishedChapters.find(
					(ch) => ch.id === currentChapter
				);

				if (currentChapterData) {
					// Get completed chapter IDs
					const completedChapterIds = completedChapters.map(
						(cp) => cp.chapterId
					);

					// Find the NEXT incomplete chapter (only chapters AFTER current position)
					const nextIncompleteChapter = publishedChapters.find(
						(chapter) =>
							chapter.position > currentChapterData.position &&
							!completedChapterIds.includes(chapter.id)
					);

					// Only move forward if there's a next incomplete chapter
					if (nextIncompleteChapter) {
						currentChapter = nextIncompleteChapter.id;

						// Update the database with the new current chapter
						await prisma.courseProgress.update({
							where: {
								userId_courseId: { userId, courseId: courseId },
							},
							data: {
								currentChapterId: currentChapter,
								lastAccessedAt: new Date(),
							},
						});
					}
				}
			}
		}

		return {
			success: true,
			progress: courseProgress,
			completedChapters: completedChapters.map((cp) => cp.chapterId),
			completionPercentage,
			totalChapters,
			completedCount: completedChapters.length,
			currentChapter: currentChapter,
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

export async function getUserLearningCourses(userId?: string): Promise<{
	data: (CourseDetails & {
		isLiked: boolean;
		likeCount: number;
		progressPercentage: number;
		lastAccessedAt: Date | null;
		isCompleted: boolean;
		currentChapterSlug?: string;
	})[];
	error?: boolean;
	message?: string;
}> {
	const session = await auth();
	const targetUserId = userId || session?.user?.id;

	if (!targetUserId) {
		return {
			data: [],
			error: true,
			message: 'User not authenticated',
		};
	}

	try {
		// Step 1: Get user's course progress
		const userProgressData = await prisma.courseProgress.findMany({
			where: { userId: targetUserId },
			select: {
				courseId: true,
				lastAccessedAt: true,
				completedAt: true,
				currentChapterId: true,
			},
			orderBy: { lastAccessedAt: 'desc' },
		});

		if (userProgressData.length === 0) {
			return { data: [], error: false };
		}

		const courseIds = userProgressData.map((p) => p.courseId);

		// Step 2: Get course details with FULL instructor structure to match CourseDetails type
		const courses = await prisma.course.findMany({
			where: {
				id: { in: courseIds },
				published: true,
			},
			include: {
				instructors: {
					include: {
						instructor: {
							include: {
								courses: { include: { course: true } },
							},
						},
					},
				},
				series: true,
				topics: { include: { topic: true } },
				chapters: {
					where: { published: true },
					orderBy: { position: 'asc' },
				},
				_count: { select: { courseProgress: true } },
				likes: true,
			},
		});

		// Step 3: Get chapter progress
		const chapterProgress = await prisma.chapterProgress.findMany({
			where: {
				userId: targetUserId,
				completed: true,
				chapter: {
					courseId: { in: courseIds },
					published: true,
				},
			},
			select: {
				chapterId: true,
				chapter: {
					select: {
						courseId: true,
					},
				},
			},
		});

		// Group completed chapters by course
		const completedChaptersByCourse = chapterProgress.reduce(
			(acc, progress) => {
				const courseId = progress.chapter.courseId;
				if (!acc[courseId]) acc[courseId] = [];
				acc[courseId].push(progress.chapterId);
				return acc;
			},
			{} as Record<string, string[]>
		);

		// Combine data and calculate progress
		const coursesWithProgress = courses.map((course) => {
			const progressInfo = userProgressData.find(
				(p) => p.courseId === course.id
			);
			const completedChapters = completedChaptersByCourse[course.id] || [];
			const totalChapters = course.chapters.length;

			const progressPercentage =
				totalChapters > 0
					? Math.round((completedChapters.length / totalChapters) * 100)
					: 0;

			// Find current chapter slug
			let currentChapterSlug;
			if (progressInfo?.currentChapterId) {
				const currentChapter = course.chapters.find(
					(ch) => ch.id === progressInfo.currentChapterId
				);
				currentChapterSlug = currentChapter?.slug;
			}

			return {
				...course,
				isLiked: course.likes.some((like) => like.userId === targetUserId),
				likeCount: course.likes.length,
				progressPercentage,
				lastAccessedAt: progressInfo?.lastAccessedAt || null,
				isCompleted: progressInfo?.completedAt !== null,
				currentChapterSlug,
			};
		});

		// Sort by last accessed
		coursesWithProgress.sort((a, b) => {
			if (!a.lastAccessedAt) return 1;
			if (!b.lastAccessedAt) return -1;
			return (
				new Date(b.lastAccessedAt).getTime() -
				new Date(a.lastAccessedAt).getTime()
			);
		});

		return { data: coursesWithProgress, error: false };
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			console.error(`Database error: ${error.code}`, error);
			return {
				data: [],
				error: true,
				message: `Database error: ${error.code}`,
			};
		}

		console.error('Error fetching user learning courses:', error);
		return {
			data: [],
			error: true,
			message:
				'Unable to retrieve your learning courses. Please try again later.',
		};
	}
}
