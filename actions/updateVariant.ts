'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/middleware';
import { revalidatePath } from 'next/cache';
import { isValidVariant } from './utils/utils';

export type PreferredVariant = 'variant1' | 'variant2' | 'variant3' | null;
const validVariants = ['variant1', 'variant2', 'variant3', null];

export async function updatePreferredVariant(
	newVariant: PreferredVariant
): Promise<{ success?: boolean; message: string }> {
	try {
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
		console.error('Error updating preferred variant:', error);

		return { success: false, message: 'Failed to update variant' };
	}
}

export async function getPreferredVariant(): Promise<PreferredVariant> {
	try {
		const session = await auth();

		if (!session?.user?.id) return null;

		const user = await prisma.user.findUnique({
			where: { id: session.user.id },
			select: { preferredVariant: true },
		});

		const variant = user?.preferredVariant || null;

		if (isValidVariant(variant)) {
			return variant as PreferredVariant;
		}

		return null;
	} catch (error) {
		console.error(error);
		return null;
	}
}
