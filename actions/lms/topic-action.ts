'use server';

import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const topicSchema = z.object({
	name: z
		.string()
		.min(2, 'Topic name must be at least 2 characters')
		.max(50, 'Topic name must be less than 50 characters')
		.trim(),
	description: z
		.string()
		.max(500, 'Description must be less than 500 characters')
		.optional()
		.nullable(),
});

export type TopicState =
	| {
			errors?: { name?: string[]; description?: string[] };
			message?: string | null;
	  }
	| undefined;

export async function createTopic(prevState: TopicState, formData: FormData) {
	const validatedFields = topicSchema.safeParse({
		name: formData.get('name'),
		description: formData.get('description') || null,
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Invalid credentials. Unable to add course topic.',
		};
	}

	try {
		const { name, description } = validatedFields.data;

		await prisma.courseTopic.create({ data: { name, description } });
		revalidatePath('/user/lms/course-topics');
	} catch (error) {
		if (
			error instanceof Prisma.PrismaClientKnownRequestError &&
			error.code === 'P2002'
		) {
			return { message: 'A topic with this name already exists' };
		}
		return { message: 'Failed to create course topic' };
	}
}

export async function updateTopic(
	id: string,
	prevState: TopicState,
	formData: FormData
) {
	const validatedFields = topicSchema.safeParse({
		name: formData.get('name'),
		description: formData.get('description') || null,
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Invalid credentials. Unable to update course topic.',
		};
	}

	try {
		const { name, description } = validatedFields.data;

		await prisma.courseTopic.update({
			where: { id },
			data: { name, description },
		});
		revalidatePath('/user/lms/course-topics');
	} catch (error) {
		if (
			error instanceof Prisma.PrismaClientKnownRequestError &&
			error.code === 'P2002'
		) {
			return { message: 'A topic with this name already exists' };
		}
		return { message: 'Failed to update course topic' };
	}
}

export type DeleteTopicState = {
	message?: string | null;
	success?: boolean;
};

export async function deleteTopic(id: string): Promise<DeleteTopicState> {
	try {
		await prisma.courseTopic.delete({ where: { id } });
		revalidatePath('/user/lms/course-topics');
		return { success: true, message: 'Course topic deleted successfully' };
	} catch (error) {
		console.error('Delete error:', error);
		return { success: false, message: 'Failed to delete course topic' };
	}
}
