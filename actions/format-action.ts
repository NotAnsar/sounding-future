'use server';

import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const formSchema = z.object({
	name: z
		.string()
		.min(1, { message: 'Format Source must be at least 1 characters long.' }),
});

export type FormatState =
	| {
			errors?: {
				name?: string[];
			};
			message?: string | null;
	  }
	| undefined;

export async function createFormat(prevState: FormatState, formData: FormData) {
	const validatedFields = formSchema.safeParse({ name: formData.get('name') });

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Invalid Credentials. Unable to Add Source Format Tag.',
		};
	}

	try {
		const { name } = validatedFields.data;
		await prisma.sourceFormat.create({ data: { name } });

		revalidatePath('/user', 'layout');
	} catch (error) {
		if (
			error instanceof Prisma.PrismaClientKnownRequestError &&
			error.code === 'P2002'
		) {
			return { message: 'Source format already exists' };
		}
		return { message: 'Failed to create source format' };
	}
}

export async function updateFormat(
	id: string,
	prevState: FormatState,
	formData: FormData
) {
	const validatedFields = formSchema.safeParse({
		name: formData.get('name'),
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Invalid Credentials. Unable to Update Format Source Tag.',
		};
	}

	try {
		const { name } = validatedFields.data;
		await prisma.sourceFormat.update({ where: { id }, data: { name } });
		revalidatePath('/user', 'layout');
	} catch (error) {
		if (
			error instanceof Prisma.PrismaClientKnownRequestError &&
			error.code === 'P2002'
		) {
			return { message: 'Source format already exists' };
		}
		return { message: 'Failed to update source format' };
	}
}

export type DeleteFormatState = {
	message?: string | null;
	success?: boolean;
};

export async function deleteFormat(id: string): Promise<DeleteFormatState> {
	try {
		await prisma.sourceFormat.delete({ where: { id } });

		revalidatePath('/user', 'layout');
		return { success: true, message: 'Source format deleted successfully' };
	} catch (error) {
		console.error('Delete error:', error);

		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			return {
				success: false,
				message: 'Source format not found or cannot be deleted',
			};
		}

		return { success: false, message: 'Failed to delete source format' };
	}
}
