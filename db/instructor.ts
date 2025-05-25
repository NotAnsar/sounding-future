import { prisma } from '@/lib/prisma';
import { Prisma, type Instructor } from '@prisma/client';

export type InstructorStats = Prisma.InstructorGetPayload<{
	include: { _count: { select: { chapters: true; courses: true } } };
}>;

type InstructorRes = {
	data: InstructorStats[];
	error?: boolean;
	message?: string;
};

export async function getInstructors(): Promise<InstructorRes> {
	try {
		const instructors = await prisma.instructor.findMany({
			include: { _count: { select: { chapters: true, courses: true } } },
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

export type InstructorChaptersAndCourses = Prisma.InstructorGetPayload<{
	include: {
		chapters: {
			include: {
				chapter: {
					include: {
						course: {
							select: {
								id: true;
								title: true;
								thumbnail: true;
							};
						};
					};
				};
			};
		};
		courses: {
			include: {
				course: {
					include: {
						chapters: {
							select: {
								id: true;
								title: true;
								position: true;
								published: true;
							};
							orderBy: { position: 'asc' };
						};
					};
				};
			};
		};
	};
}>;

export async function getInstructorChaptersAndCourses(
	instructorId: string
): Promise<{
	error?: boolean;
	message?: string;
	data: InstructorChaptersAndCourses | null;
}> {
	try {
		const instructor = await prisma.instructor.findUnique({
			where: { id: instructorId },
			include: {
				chapters: {
					include: {
						chapter: {
							include: {
								course: {
									select: {
										id: true,
										title: true,
										thumbnail: true,
									},
								},
							},
						},
					},
				},
				courses: {
					include: {
						course: {
							include: {
								chapters: {
									select: {
										id: true,
										title: true,
										position: true,
										published: true,
									},
									orderBy: { position: 'asc' },
								},
							},
						},
					},
				},
			},
		});

		if (!instructor) {
			return { data: null, error: true, message: 'Instructor not found' };
		}

		return { data: instructor, error: false };
	} catch (error) {
		console.error('Error fetching instructor chapters and courses:', error);
		return {
			data: null,
			error: true,
			message:
				'Unable to retrieve instructor chapters and courses. Please try again later.',
		};
	}
}
