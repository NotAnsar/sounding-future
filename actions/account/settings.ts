'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { imageSchema, State } from '../utils/utils';
import { updateFile, deleteFile } from '../utils/s3-image';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const SettingSchema = z.object({
	firstName: z
		.string()
		.min(1, 'First name is required')
		.max(50, 'First name must be 50 characters or less'),
	secondName: z
		.string()
		.min(1, 'Second name is required')
		.max(50, 'Second name must be 50 characters or less'),
	username: z
		.string()
		.min(1, 'Username is required')
		.max(30, 'Username must be 30 characters or less'),
	image: imageSchema.shape.file.optional(),
	deleteImage: z.string().optional(),
});

type SettingsData = z.infer<typeof SettingSchema>;

export type SettingsState = State<SettingsData> & {
	prev?: { image?: string };
	success?: boolean;
};

export async function updateUserAccount(
	prevState: SettingsState,
	formData: FormData
): Promise<SettingsState> {
	console.log(formData.get('deleteImage'));

	const validatedFields = SettingSchema.omit({ image: true }).safeParse({
		firstName: formData.get('firstName'),
		secondName: formData.get('secondName'),
		username: formData.get('username'),
		deleteImage: formData.get('deleteImage') || undefined,
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Failed to update account. Please check the form for errors.',
		};
	}

	const { firstName, secondName, username, deleteImage } = validatedFields.data;

	try {
		const session = await auth();
		if (!session?.user?.id) {
			throw new Error('Not authenticated');
		}

		let imageUrl: string | undefined | null = prevState?.prev?.image;

		// Handle image deletion
		if (deleteImage === 'true') {
			if (prevState?.prev?.image) {
				await deleteFile(prevState.prev.image);
			}
			imageUrl = null;
		} else {
			imageUrl = await updateFile(
				formData.get('image'),
				prevState?.prev?.image
			);
		}

		await prisma.user.update({
			where: { id: session.user.id },
			data: {
				name: username,
				f_name: firstName,
				l_name: secondName,
				image: imageUrl,
			},
		});

		revalidatePath('/', 'layout');
		return { success: true };
	} catch (error) {
		console.error('Update error:', error);
		return {
			message: 'Failed to update account. Please try again.',
			success: false,
		};
	}
}
