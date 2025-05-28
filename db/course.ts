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
				chapters: { orderBy: { position: 'asc' } },
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
