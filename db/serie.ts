import { prisma } from '@/lib/prisma';
import { Prisma, type CourseSeries } from '@prisma/client';

type CourseSeriesRes = {
	data: CourseSeries[];
	error?: boolean;
	message?: string;
};

export async function getSeries(): Promise<CourseSeriesRes> {
	try {
		const series = await prisma.courseSeries.findMany({
			orderBy: { createdAt: 'desc' },
		});

		return { data: series, error: false };
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			console.error(`Database error: ${error.code}`, error);
			return {
				data: [],
				error: true,
				message: `Database error`,
			};
		}

		if (error instanceof Prisma.PrismaClientValidationError) {
			console.error('Validation error:', error);
			return { data: [], error: true, message: 'Invalid data provided' };
		}

		console.error('Error fetching course series:', error);
		return {
			data: [],
			error: true,
			message: 'Unable to retrieve course series. Please try again later.',
		};
	}
}

export type SeriesDetails = CourseSeries;

type SeriesDetailsRes = {
	error?: boolean;
	message?: string;
	data: SeriesDetails | null;
};

export async function getSeriesById(id: string): Promise<SeriesDetailsRes> {
	try {
		const series = await prisma.courseSeries.findUnique({
			where: { id },
		});

		if (!series) {
			return { data: null, error: true, message: 'Course series not found' };
		}

		return { data: series, error: false };
	} catch (error) {
		console.error('Error fetching course series:', error);
		return {
			data: null,
			error: true,
			message: 'Unable to retrieve course series. Please try again later.',
		};
	}
}
