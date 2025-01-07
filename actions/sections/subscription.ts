'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { State } from '../utils/utils';
import { prisma } from '@/lib/prisma';

const SubscriptionSchema = z.object({
	content: z.string().min(2, 'Content is required').trim(),
	link: z.string().url('Invalid Subscription URL').trim(),
	label: z.string().min(2, 'Button text is required').trim(),
	footer: z.string().trim().optional(),
});

type SubscriptionData = z.infer<typeof SubscriptionSchema>;

export type SubscriptionState = State<SubscriptionData> & {
	success?: boolean;
};

export async function updateSubscription(
	prevState: SubscriptionState,
	formData: FormData
): Promise<SubscriptionState> {
	const id = 'cm5mkvhvr0000w6jgtu3eow1l';

	const processedData = {
		footer: formData.get('footer')?.toString(),
		content: formData.get('content')?.toString() || null,
		link: formData.get('link')?.toString() || null,
		label: formData.get('label')?.toString() || null,
	};

	const validatedFields = SubscriptionSchema.safeParse(processedData);

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message:
				'Failed to update Become a Supporter section. Please check the form for errors.',
		};
	}

	const { content, label, link, footer } = validatedFields.data;

	try {
		await prisma.newsLetter.update({
			where: { id },
			data: { content, label, link, footer },
		});

		revalidatePath('/', 'layout');
		return { success: true };
	} catch (error) {
		console.error('Become a Supporter section error:', error);
		return {
			message: 'Failed to update Become a Supporter section. Please try again.',
			success: false,
		};
	}
}
