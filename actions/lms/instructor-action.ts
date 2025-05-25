'use server';

import { z } from 'zod';
import { DeleteState, imageSchema, State } from '@/actions/utils/utils';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Prisma } from '@prisma/client';
import {
	checkFile,
	deleteFile,
	updateFile,
	uploadFile,
} from '@/actions/utils/s3-image';

// Define Instructor schema for validation
const InstructorSchema = z.object({
	name: z
		.string()
		.min(1, 'Instructor name is required')
		.max(100, 'Instructor name must be 100 characters or less'),
	bio: z.string().optional(),
	image: imageSchema.shape.file,
	published: z.boolean().optional(),
	artistId: z.string().optional(),
});

type InstructorData = z.infer<typeof InstructorSchema>;

export type InstructorFormState = State<InstructorData> & {
	prev?: { image?: string | undefined };
};

export async function addInstructor(
	prevState: InstructorFormState,
	formData: FormData
): Promise<InstructorFormState> {
	const validatedFields = InstructorSchema.safeParse({
		name: formData.get('name'),
		bio: formData.get('bio') || undefined,
		artistId: formData.get('artistId') || undefined,
		image: await checkFile(formData.get('image')),
		published: formData.get('published') === 'true',
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message:
				'Failed to add new instructor. Please check the form for errors.',
		};
	}

	const { name, bio, image, published, artistId } = validatedFields.data;

	try {
		const imageUrl = image ? await uploadFile(image) : undefined;

		await prisma.instructor.create({
			data: {
				name,
				bio,
				image: imageUrl,
				published: published || false,
				artistId,
			},
		});

		revalidatePath('/user/lms', 'layout');
	} catch (error) {
		console.error(error);

		if (
			error instanceof Prisma.PrismaClientKnownRequestError &&
			error.code === 'P2002'
		) {
			return { message: 'Instructor already exists' };
		}
		return { message: 'Failed to create instructor' };
	}
	redirect('/user/lms/instructors');
}

export async function updateInstructor(
	id: string,
	prevState: InstructorFormState,
	formData: FormData
): Promise<InstructorFormState> {
	const validatedFields = InstructorSchema.omit({ image: true }).safeParse({
		name: formData.get('name'),
		bio: formData.get('bio') || undefined,
		published: formData.get('published') === 'true',
		artistId: formData.get('artistId') || undefined,
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Failed to update instructor. Please check the form for errors.',
		};
	}

	const image = formData.get('image');
	if (image instanceof File && image.size > 2 * 1024 * 1024) {
		return {
			message: 'Instructor image must be less than 2MB',
			errors: { image: ['Instructor image must be less than 2MB'] },
		};
	}

	const { name, bio, published, artistId } = validatedFields.data;

	try {
		const previousInstructor = await prisma.instructor.findUnique({
			where: { id },
		});
		if (!previousInstructor) {
			return { message: 'Instructor not found' };
		}

		const imageUrl = await updateFile(
			image,
			previousInstructor?.image || undefined
		);

		await prisma.instructor.update({
			where: { id },
			data: {
				name,
				bio,
				image: imageUrl,
				published,
				artistId: artistId ? artistId : null,
			},
		});

		revalidatePath('/', 'layout');
	} catch (error) {
		console.log(error);

		if (
			error instanceof Prisma.PrismaClientKnownRequestError &&
			error.code === 'P2002'
		) {
			return { message: 'An instructor with this name already exists' };
		}
		return { message: 'Failed to update instructor' };
	}
	redirect('/user/lms/instructors');
}

export async function deleteInstructor(id: string): Promise<DeleteState> {
	try {
		const instructor = await prisma.instructor.delete({ where: { id } });

		if (!instructor) {
			return { success: false, message: 'Instructor not found' };
		}

		// Delete image if it exists
		if (instructor.image) await deleteFile(instructor.image);

		revalidatePath('/user/lms', 'layout');
		return { success: true, message: 'Instructor deleted successfully' };
	} catch (error) {
		console.error('Delete error:', error);

		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			return {
				success: false,
				message: 'Instructor not found or cannot be deleted',
			};
		}

		return { success: false, message: 'Failed to delete instructor' };
	}
}

import {
	getInstructorChaptersAndCourses,
	InstructorChaptersAndCourses,
} from '@/db/instructor';

export async function getInstructorCoursesAction(
	instructorId: string
): Promise<{
	success: boolean;
	data: InstructorChaptersAndCourses | null;
	error?: string;
}> {
	try {
		const result = await getInstructorChaptersAndCourses(instructorId);

		if (result.error) {
			return {
				success: false,
				data: null,
				error: result.message || 'Failed to fetch instructor data',
			};
		}

		return {
			success: true,
			data: result.data,
		};
	} catch (error) {
		console.error('Server action error:', error);
		return {
			success: false,
			data: null,
			error: 'Failed to fetch instructor courses and chapters',
		};
	}
}
