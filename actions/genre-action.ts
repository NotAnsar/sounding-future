'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const formSchema = z.object({
	name: z
		.string()
		.min(3, { message: 'Genre Name must be at least 3 characters long.' }),
});

export type GenreState =
	| {
			errors?: {
				name?: string[];
			};
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

	const { name } = validatedFields.data;

	console.log(name);

	try {
	} catch (error) {}
	revalidatePath('/user/tags', 'layout');
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

	const { name } = validatedFields.data;

	console.log(name);

	try {
	} catch (error) {}
	revalidatePath('/user/tags', 'layout');
}

export type DeleteGenreState = {
	message?: string | null;
	type?: string | null;
};

export async function deleteGenre(id: string) {
	console.log(id);

	revalidatePath('/user/tags', 'layout');
	return { message: 'Genre Tag Was Deleted Successfully.' };
}
