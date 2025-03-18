'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { State } from '../utils/utils';
import { prisma } from '@/lib/prisma';

const SupportUsSchema = z.object({
	heading: z.string().min(2, 'Heading is required').trim(),
	subheading: z.string().min(2, 'Subheading is required').trim(),
	footer: z.string().trim().optional(),
});

type SupportUsData = z.infer<typeof SupportUsSchema>;

export type SupportUsState = State<SupportUsData> & {
	success?: boolean;
};

export async function updateSupportUs(
	prevState: SupportUsState,
	formData: FormData
): Promise<SupportUsState> {
	const processedData = {
		heading: formData.get('heading')?.toString() || null,
		subheading: formData.get('subheading')?.toString() || null,
		footer: formData.get('footer')?.toString(),
	};

	const validatedFields = SupportUsSchema.safeParse(processedData);

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message:
				'Failed to update Support Us section. Please check the fields and try again.',
		};
	}

	const { heading, subheading, footer } = validatedFields.data;

	try {
		await prisma.pricingPage.upsert({
			where: { id: '1' },
			create: { id: '1', heading, subheading, footer },
			update: { heading, subheading, footer },
		});

		revalidatePath('/', 'layout');
		return { success: true };
	} catch (error) {
		console.error('Failed to update Support Us section', error);
		return {
			message: 'Failed to update Support Us section. Please try again.',
			success: false,
		};
	}
}
