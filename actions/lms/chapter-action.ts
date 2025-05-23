'use server';

import { z } from 'zod';
import { State } from '@/actions/utils/utils';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Define Chapter schema for validation
const ChapterSchema = z.object({
	title: z
		.string()
		.min(1, 'Chapter title is required')
		.max(200, 'Chapter title must be 200 characters or less'),
	description: z.string().optional(),
	content: z.string().optional(),
	videoUrl: z.string().url('Invalid video URL').optional(),
	duration: z.number().min(0, 'Duration must be positive').optional(),
	courseId: z.string().min(1, 'Course is required'),
	accessType: z.string().default('PRO'),
	published: z.boolean().default(false),
	position: z.number().min(1, 'Position must be at least 1'),
});

type ChapterData = z.infer<typeof ChapterSchema>;

export type ChapterFormState = State<ChapterData>;

export type DeleteChapterState = {
	message?: string | null;
	success?: boolean;
};

// Helper function to get next position for chapter
async function getNextChapterPosition(courseId: string): Promise<number> {
	const lastChapter = await prisma.chapter.findFirst({
		where: { courseId },
		orderBy: { position: 'desc' },
		select: { position: true },
	});

	return (lastChapter?.position || 0) + 1;
}

export async function addChapter(
	prevState: ChapterFormState,
	formData: FormData
): Promise<ChapterFormState> {
	const courseId = formData.get('courseId')?.toString();

	if (!courseId) {
		return {
			errors: { courseId: ['Course is required'] },
			message: 'Course is required',
		};
	}

	// Get next position
	const position = await getNextChapterPosition(courseId);

	const validatedFields = ChapterSchema.safeParse({
		title: formData.get('title'),
		description: formData.get('description') || undefined,
		content: formData.get('content') || undefined,
		videoUrl: formData.get('videoUrl') || undefined,
		duration: formData.get('duration')
			? Number(formData.get('duration'))
			: undefined,
		courseId: courseId,
		accessType: formData.get('accessType') || 'PRO',
		published: formData.get('published') === 'true',
		position: position,
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Failed to create chapter. Please check the form for errors.',
		};
	}

	try {
		await prisma.chapter.create({
			data: validatedFields.data,
		});

		revalidatePath('/user/lms/chapters');
	} catch (error) {
		console.error('Create chapter error:', error);
		return { message: 'Failed to create chapter' };
	}

	redirect('/user/lms/chapters');
}

export async function updateChapter(
	id: string,
	prevState: ChapterFormState,
	formData: FormData
): Promise<ChapterFormState> {
	const validatedFields = ChapterSchema.omit({ position: true }).safeParse({
		title: formData.get('title'),
		description: formData.get('description') || undefined,
		content: formData.get('content') || undefined,
		videoUrl: formData.get('videoUrl') || undefined,
		duration: formData.get('duration')
			? Number(formData.get('duration'))
			: undefined,
		courseId: formData.get('courseId'),
		accessType: formData.get('accessType') || 'PRO',
		published: formData.get('published') === 'true',
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Failed to update chapter. Please check the form for errors.',
		};
	}

	try {
		await prisma.chapter.update({
			where: { id },
			data: validatedFields.data,
		});

		revalidatePath('/user/lms/chapters');
	} catch (error) {
		console.error('Update chapter error:', error);
		return { message: 'Failed to update chapter' };
	}

	redirect('/user/lms/chapters');
}

export async function deleteChapter(id: string): Promise<DeleteChapterState> {
	try {
		await prisma.chapter.delete({ where: { id } });

		revalidatePath('/user/lms/chapters');
		return { success: true, message: 'Chapter deleted successfully' };
	} catch (error) {
		console.error('Delete chapter error:', error);
		return { success: false, message: 'Failed to delete chapter' };
	}
}
