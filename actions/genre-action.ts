'use server';

import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const formSchema = z.object({
	name: z
		.string()
		.min(2, 'Genre Name must be at least 2 characters')
		.max(50, 'Genre Name must be less than 50 characters')
		.trim(),
});

export type GenreState =
	| {
			errors?: { name?: string[] };
			message?: string | null;
	  }
	| undefined;

export async function createGenre(prevState: GenreState, formData: FormData) {
	const validatedFields = formSchema.safeParse({ name: formData.get('name') });

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Invalid Credentials. Unable to Add Genre Tag.',
		};
	}

	try {
		const { name } = validatedFields.data;
		await prisma.genre.create({ data: { name } });

		revalidatePath('/', 'layout');
	} catch (error) {
		if (
			error instanceof Prisma.PrismaClientKnownRequestError &&
			error.code === 'P2002'
		) {
			return { message: 'Genre already exists' };
		}
		return { message: 'Failed to create genre' };
	}
}

export async function updateGenre(
	id: string,
	prevState: GenreState,
	formData: FormData
) {
	const validatedFields = formSchema.safeParse({
		name: formData.get('name'),
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Invalid Credentials. Unable to Update Genre Tag.',
		};
	}

	try {
		const { name } = validatedFields.data;
		await prisma.genre.update({ where: { id }, data: { name } });
		revalidatePath('/', 'layout');
	} catch (error) {
		return { message: 'Failed to update genre' };
	}
}

export type DeleteGenreState = {
	message?: string | null;
	success?: boolean;
};

export async function deleteGenre(id: string): Promise<DeleteGenreState> {
	try {
		await prisma.genre.delete({ where: { id } });

		revalidatePath('/', 'layout');
		return { success: true, message: 'Genre deleted successfully' };
	} catch (error) {
		console.error('Delete error:', error);

		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			return {
				success: false,
				message: 'Genre not found or cannot be deleted',
			};
		}

		return { success: false, message: 'Failed to delete genre' };
	}
}
