'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { State } from '../../utils/utils';

const formSchema = z.object({
	websiteUrl: z.string().url('Invalid URL').trim(),
	websiteName: z
		.string()
		.min(2, 'Website name must be at least 2 characters')
		.trim(),
	description: z.string().min(2, 'Description is required').trim(),
});

type AboutHeaderData = z.infer<typeof formSchema>;

export type AboutHeaderState = State<AboutHeaderData> & {
	success?: boolean;
};

export async function updateAboutHeader(
	prevState: AboutHeaderState,
	formData: FormData
): Promise<AboutHeaderState> {
	const validatedFields = formSchema.safeParse({
		websiteUrl: formData.get('websiteUrl'),
		websiteName: formData.get('websiteName'),
		description: formData.get('description'),
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Invalid data. Unable to update about header.',
		};
	}

	try {
		await prisma.aboutHeader.upsert({
			where: { id: '1' },
			create: validatedFields.data,
			update: validatedFields.data,
		});

		revalidatePath('/');
		return { success: true, message: 'About header updated successfully' };
	} catch (error) {
		return { message: 'Failed to update about header', success: false };
	}
}
