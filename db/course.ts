import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export type CourseWithRelations = Prisma.CourseGetPayload<{
	include: {
		instructors: { include: { instructor: true } };
		series: true;
		topics: { include: { topic: true } };
		chapters: true;
	};
}>;

type CourseRes = {
	data: CourseWithRelations[];
	error?: boolean;
	message?: string;
};

export async function getCourses(published?: boolean): Promise<CourseRes> {
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
	data: (CourseDetails & { isLiked: boolean; likeCount: number })[];
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
				likes: true,
			},
			orderBy: { createdAt: 'desc' },
		});

		const coursesWithLikeInfo = courses.map((course) => ({
			...course,
			isLiked: true,
			likeCount: course.likes.length,
		}));

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
