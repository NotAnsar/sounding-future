import { prisma } from '@/lib/prisma';
import { Prisma, type Instructor } from '@prisma/client';

type InstructorRes = { data: Instructor[]; error?: boolean; message?: string };

export async function getInstructors(): Promise<InstructorRes> {
	try {
		const instructors = await prisma.instructor.findMany({
			orderBy: { createdAt: 'desc' },
		});

		return { data: instructors, error: false };
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			// Handle specific Prisma errors
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

		// Generic error handling
		console.error('Error fetching instructors:', error);
		return {
			data: [],
			error: true,
			message: 'Unable to retrieve instructors. Please try again later.',
		};
	}
}

export type InstructorDetails = Instructor;

type InstructorDetailsRes = {
	error?: boolean;
	message?: string;
	data: InstructorDetails | null;
};

export async function getInstructorById(
	id?: string
): Promise<InstructorDetailsRes> {
	try {
		if (!id) {
			return { data: null, error: true, message: 'Instructor ID is required' };
		}

		const instructor = await prisma.instructor.findUnique({
			where: { id },
		});

		if (!instructor) {
			return { data: null, error: true, message: 'Instructor not found' };
		}

		return { data: instructor, error: false };
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			// Handle specific Prisma errors
			console.error(`Database error: ${error.code}`, error);

			return { data: null, error: true, message: `Database error` };
		}

		if (error instanceof Prisma.PrismaClientValidationError) {
			console.error('Validation error:', error);
			return { data: null, error: true, message: 'Invalid data provided' };
		}

		// Generic error handling
		console.error('Error fetching instructor:', error);
		return {
			data: null,
			error: true,
			message: 'Unable to retrieve instructor. Please try again later.',
		};
	}
}
