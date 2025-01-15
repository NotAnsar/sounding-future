'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { State } from '../utils/utils';
import { prisma } from '@/lib/prisma';

const SubscriptionCardSchema = z.object({
	title: z.string().min(2, 'Title is required').trim(),
	subtitle: z.string().trim().optional(),
	priceInfo: z.string().min(1, 'Price information is required').trim(),
	reasonsTitle: z.string().min(2, 'Reasons title is required').trim(),
	reasons: z
		.array(z.string().min(1, 'Reason is required'))
		.nonempty('At least one reason is required'),
	footer: z.string().trim().optional(),
});

type SubscriptionCardData = z.infer<typeof SubscriptionCardSchema>;

export type SubscriptionCardState = State<SubscriptionCardData> & {
	success?: boolean;
};

export async function updateSubscriptionCard(
	prevState: SubscriptionCardState,
	formData: FormData
): Promise<SubscriptionCardState> {
	const processedData = {
		title: formData.get('title')?.toString() || null,
		subtitle: formData.get('subtitle')?.toString(),
		priceInfo: formData.get('priceInfo')?.toString() || null,
		reasonsTitle: formData.get('reasonsTitle')?.toString() || null,
		reasons: formData.getAll('reasons') || [],
		footer: formData.get('footer')?.toString(),
	};

	const validatedFields = SubscriptionCardSchema.safeParse(processedData);

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message:
				'Failed to update Subscription Card. Please check the form for errors.',
		};
	}

	const { title, subtitle, priceInfo, reasonsTitle, reasons, footer } =
		validatedFields.data;

	const id = 'cm5of2z7j0000m9p63r1b6qmw';
	try {
		await prisma.subscriptionCard.upsert({
			where: { id },
			create: { title, subtitle, priceInfo, reasonsTitle, reasons, footer, id },
			update: { title, subtitle, priceInfo, reasonsTitle, reasons, footer },
		});

		revalidatePath('/', 'layout');
		return { success: true };
	} catch (error) {
		console.error('Subscription Card update error:', error);
		return {
			message: 'Failed to update Subscription Card. Please try again.',
			success: false,
		};
	}
}
