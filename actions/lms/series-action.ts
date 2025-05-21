'use server';

import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const seriesSchema = z.object({
	name: z
		.string()
		.min(2, 'Series name must be at least 2 characters')
		.max(50, 'Series name must be less than 50 characters')
		.trim(),
	description: z
		.string()
		.max(500, 'Description must be less than 500 characters')
		.optional()
		.nullable(),
});

export type SeriesState =
	| {
			errors?: { name?: string[]; description?: string[] };
			message?: string | null;
	  }
	| undefined;

export async function createSeries(prevState: SeriesState, formData: FormData) {
	const validatedFields = seriesSchema.safeParse({
		name: formData.get('name'),
		description: formData.get('description') || null,
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Invalid credentials. Unable to add course series.',
		};
	}

	try {
		const { name, description } = validatedFields.data;

		await prisma.courseSeries.create({ data: { name, description } });
		revalidatePath('/user/lms/course-series');
	} catch (error) {
		if (
			error instanceof Prisma.PrismaClientKnownRequestError &&
			error.code === 'P2002'
		) {
			return { message: 'A series with this name already exists' };
		}
		return { message: 'Failed to create course series' };
	}
}

export async function updateSeries(
	id: string,
	prevState: SeriesState,
	formData: FormData
) {
	const validatedFields = seriesSchema.safeParse({
		name: formData.get('name'),
		description: formData.get('description') || null,
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Invalid credentials. Unable to update course series.',
		};
	}

	try {
		const { name, description } = validatedFields.data;

		await prisma.courseSeries.update({
			where: { id },
			data: { name, description },
		});
		revalidatePath('/user/lms/course-series');
	} catch (error) {
		if (
			error instanceof Prisma.PrismaClientKnownRequestError &&
			error.code === 'P2002'
		) {
			return { message: 'A series with this name already exists' };
		}
		return { message: 'Failed to update course series' };
	}
}

export type DeleteSeriesState = {
	message?: string | null;
	success?: boolean;
};

export async function deleteSeries(id: string): Promise<DeleteSeriesState> {
	try {
		await prisma.courseSeries.delete({ where: { id } });
		revalidatePath('/user/lms/course-series');
		return { success: true, message: 'Course series deleted successfully' };
	} catch (error) {
		console.error('Delete error:', error);
		return { success: false, message: 'Failed to delete course series' };
	}
}
