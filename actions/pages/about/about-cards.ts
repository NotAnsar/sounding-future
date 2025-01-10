'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { State } from '../../utils/utils';
import { prisma } from '@/lib/prisma';

const AboutCardsSchema = z.object({
	heading: z.string().min(1, 'Heading is required').trim(),
	card1: z.string().min(1, 'Card 1 is required').trim(),
	card2: z.string().min(1, 'Card 2 is required').trim(),
	card3: z.string().min(1, 'Card 3 is required').trim(),
	card4: z.string().min(1, 'Card 4 is required').trim(),
	card5: z.string().min(1, 'Card 5 is required').trim(),
});

type AboutCardsData = z.infer<typeof AboutCardsSchema>;

export type AboutCardsState = State<AboutCardsData> & {
	success?: boolean;
};

export async function updateAboutCards(
	type: 'producers' | 'consumers',
	prevState: AboutCardsState,
	formData: FormData
): Promise<AboutCardsState> {
	const id = type === 'producers' ? '2' : '1';

	const processedData = {
		heading: formData.get('heading')?.toString() || '',
		card1: formData.get('card1')?.toString() || '',
		card2: formData.get('card2')?.toString() || '',
		card3: formData.get('card3')?.toString() || '',
		card4: formData.get('card4')?.toString() || '',
		card5: formData.get('card5')?.toString() || '',
	};

	const validatedFields = AboutCardsSchema.safeParse(processedData);

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: `Failed to update ${type} about cards section. Please check the form for errors.`,
		};
	}

	try {
		await prisma.aboutCards.upsert({
			where: { id },
			create: validatedFields.data,
			update: validatedFields.data,
		});

		revalidatePath('/', 'layout');
		return { success: true };
	} catch (error) {
		console.error(`${type} About cards section error:`, error);
		return {
			message: `Failed to update ${type} about cards section. Please try again.`,
			success: false,
		};
	}
}
