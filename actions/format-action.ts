'use server';

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
			message: 'Invalid Credentials. Unable to Add Format Source Tag.',
		};
	}

	const { name } = validatedFields.data;

	console.log(name);

	try {
	} catch (error) {}
	revalidatePath('/user/tags', 'layout');
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

	const { name } = validatedFields.data;

	console.log(name);

	try {
	} catch (error) {}
	revalidatePath('/user/tags', 'layout');
}

export type DeleteFormatState = {
	message?: string | null;
	type?: string | null;
};

export async function deleteFormat(id: string) {
	console.log(id);

	revalidatePath('/user/tags', 'layout');
	return { message: 'Format Source Tag Was Deleted Successfully.' };
}
