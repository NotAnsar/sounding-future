'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/middleware';
import { revalidatePath } from 'next/cache';

export type PreferredVariant = 'variant1' | 'variant2' | 'variant3' | null;

export async function updatePreferredVariant(
	newVariant: PreferredVariant
): Promise<{ success?: boolean; message: string }> {
	try {
		const validVariants = ['variant1', 'variant2', 'variant3', null];
		if (!validVariants.includes(newVariant)) {
			return { success: false, message: 'Invalid variant' };
		}

		const session = await auth();

		if (!session?.user?.id) {
			return {
				success: false,
				message: 'You must be logged in to update your preferred variant',
			};
		}

		await prisma.user.update({
			where: { id: session?.user?.id },
			data: { preferredVariant: newVariant },
		});

		revalidatePath('/');
		return { success: true, message: 'Variant status updated' };
	} catch (error) {
		console.log(error);

		return { success: false, message: 'Failed to update variant' };
	}
}
