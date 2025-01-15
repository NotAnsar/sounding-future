'use server';

import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { State } from '../utils/utils';

const formSchema = z.object({
	title: z.string().min(2, 'Title must be at least 2 characters').trim(),
	content: z.string().min(2, 'Content is required').trim(),
	items: z.array(z.string()),
	footer: z.string().optional(),
});

type TermsSectionData = z.infer<typeof formSchema>;

export type TermsSectionState = State<TermsSectionData> & {
	success?: boolean;
};

export async function createTermsSection(
	type: 'terms' | 'privacy',
	prevState: TermsSectionState,
	formData: FormData
): Promise<TermsSectionState> {
	const termsPageId =
		type === 'privacy'
			? 'cm5mz7rox00055l73fjehn81t'
			: 'cm5mygk0d00005l73t2exhowi';
	const validatedFields = formSchema.safeParse({
		title: formData.get('title'),
		content: formData.get('content'),
		items: formData.getAll('items'),
		footer: formData.get('footer'),
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Invalid data. Unable to create terms section.',
		};
	}

	try {
		await prisma.termsSection.create({
			data: { ...validatedFields.data, termsPageId },
		});

		revalidatePath('/');
		return {
			success: true,
			message: 'Terms section created successfully',
		};
	} catch (error) {
		return { message: 'Failed to create terms section', success: false };
	}
}

export async function updateTermsSection(
	id: string,
	prevState: TermsSectionState,
	formData: FormData
): Promise<TermsSectionState> {
	const validatedFields = formSchema.safeParse({
		title: formData.get('title'),
		content: formData.get('content'),
		items: formData.getAll('items'),
		footer: formData.get('footer'),
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Invalid data. Unable to update terms section.',
		};
	}

	try {
		await prisma.termsSection.update({
			where: { id },
			data: validatedFields.data,
		});
		revalidatePath('/');
		return { success: true, message: 'Terms section updated successfully' };
	} catch (error) {
		return { message: 'Failed to update terms section', success: false };
	}
}

export async function reorderTermsSections(
	updates: { id: string; order: number }[]
) {
	try {
		await prisma.$transaction(
			updates.map((update) =>
				prisma.termsSection.update({
					where: { id: update.id },
					data: { order: update.order },
				})
			)
		);
		revalidatePath('/');
		return { success: true };
	} catch (error) {
		console.error('Failed to reorder terms sections:', error);
		return { success: false, error: 'Failed to reorder terms sections' };
	}
}

export type DeleteTermsSectionState = {
	message?: string | null;
	success?: boolean;
};

export async function deleteTermsSection(
	id: string
): Promise<DeleteTermsSectionState> {
	try {
		await prisma.termsSection.delete({ where: { id } });
		revalidatePath('/');
		return { success: true, message: 'Terms section deleted successfully' };
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			return {
				success: false,
				message: 'Terms section not found or cannot be deleted',
			};
		}
		return { success: false, message: 'Failed to delete terms section' };
	}
}

const metadataSchema = z.object({
	introduction: z.string().trim().optional(),
	footer: z.string().trim().optional(),
});

export type TermsPageMetadataState = State<z.infer<typeof metadataSchema>> & {
	success?: boolean;
};

export async function updateTermsMetadata(
	type: 'terms' | 'privacy',
	field: 'introduction' | 'footer',
	prevState: TermsPageMetadataState,
	formData: FormData
): Promise<TermsPageMetadataState> {
	const validatedFields = metadataSchema.safeParse({
		[field]: formData.get(field),
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: `Invalid data. Unable to update ${type} page ${field}.`,
		};
	}
	const id =
		type === 'privacy'
			? 'cm5mz7rox00055l73fjehn81t'
			: 'cm5mygk0d00005l73t2exhowi';

	try {
		await prisma.termsPage.upsert({
			where: {
				id,
			},
			create: {
				...validatedFields.data,
				id,
				title: type === 'privacy' ? 'Privacy Policy' : 'Terms of Service',
			},
			update: validatedFields.data,
		});

		revalidatePath('/');
		return {
			success: true,
			message: `${type} page ${field} updated successfully`,
		};
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			return {
				success: false,
				message: 'Terms page not found',
			};
		}
		return {
			success: false,
			message: `Failed to update ${type} page ${field}`,
		};
	}
}
