'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { State } from '../utils/utils';
import { prisma } from '@/lib/prisma';

const NewsLetterSchema = z.object({
	title: z.string().min(2, 'Title must be at least 2 characters').trim(),
	content: z.string().min(2, 'Description is required').trim(),
	link: z.string().url('Invalid NewsLetter URL').trim(),
	label: z.string().min(2, 'Button text is required').trim(),
});

type NewsLetterData = z.infer<typeof NewsLetterSchema>;

export type NewsLetterState = State<NewsLetterData> & {
	success?: boolean;
};

export async function updateNewsLetter(
	prevState: NewsLetterState,
	formData: FormData
): Promise<NewsLetterState> {
	const id = 'cm5mjsckm000013no8aqexof6';

	const processedData = {
		title: formData.get('title')?.toString() || null,
		content: formData.get('content')?.toString() || null,
		link: formData.get('link')?.toString() || null,
		label: formData.get('label')?.toString() || null,
	};

	const validatedFields = NewsLetterSchema.safeParse(processedData);

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message:
				'Failed to update newsletter section. Please check the form for errors.',
		};
	}

	const { content, label, link, title } = validatedFields.data;

	try {
		await prisma.newsLetter.update({
			where: { id },
			data: { content, label, link, title },
		});

		revalidatePath('/', 'layout');
		return { success: true };
	} catch (error) {
		console.error('newsletter section error:', error);
		return {
			message: 'Failed to update newsletter section. Please try again.',
			success: false,
		};
	}
}
