// 'use server';

// import { revalidatePath } from 'next/cache';
// import { z } from 'zod';
// import { imageSchema, State } from '../utils/utils';
// import { updateFile } from '../utils/s3-image';
// import { auth } from '@/lib/auth';
// import { prisma } from '@/lib/prisma';

// // Define the schema for registration
// const SettingSchema = z.object({
// 	firstName: z
// 		.string()
// 		.min(1, 'First name is required')
// 		.max(50, 'First name must be 50 characters or less'),
// 	secondName: z
// 		.string()
// 		.min(1, 'Second name is required')
// 		.max(50, 'Second name must be 50 characters or less'),
// 	// email: z.string().min(1, 'Email is required').email('Invalid email address'),
// 	username: z
// 		.string()
// 		.min(1, 'Username is required')
// 		.max(30, 'Username must be 30 characters or less'),
// 	image: imageSchema.shape.file.optional(),
// 	// password: z
// 	// 	.string()
// 	// 	.min(8, { message: 'Your password must have at least 8 characters.' }),
// 	// confirmPassword: z.string().min(1, 'Please confirm your password'),
// });
// // .refine((data) => data.password === data.confirmPassword, {
// // 	message: "Passwords don't match",
// // 	path: ['confirmPassword'],
// // });

// type SettingsData = z.infer<typeof SettingSchema>;

// export type SettingsState = State<SettingsData> & { prev?: { image?: string } };

// export async function updateUserAccount(
// 	prevState: SettingsState,
// 	formData: FormData
// ): Promise<SettingsState> {
// 	const validatedFields = SettingSchema.omit({ image: true }).safeParse({
// 		firstName: formData.get('firstName'),
// 		secondName: formData.get('secondName'),
// 		// email: formData.get('email'),
// 		username: formData.get('username'),
// 	});

// 	if (!validatedFields.success) {
// 		return {
// 			errors: validatedFields.error.flatten().fieldErrors,
// 			message: 'Failed to register. Please check the form for errors.',
// 		};
// 	}

// 	const { firstName, secondName, username } = validatedFields.data;

// 	try {
// 		const session = await auth();
// 		if (!session?.user?.id) {
// 			throw new Error();
// 		}

// 		const imageUrl = await updateFile(
// 			formData.get('image'),
// 			prevState?.prev?.image
// 		);

// 		console.log('Account user:', {
// 			firstName,
// 			secondName,
// 			username,
// 			// Don't log passwords in production!
// 		});

// 		await prisma.user.update({
// 			where: { id: session.user.id },
// 			data: {
// 				name: username,
// 				f_name: firstName,
// 				l_name: secondName,
// 				image: imageUrl,
// 			},
// 		});

// 		revalidatePath('/', 'layout');
// 		return { message: 'Account updated successfully' };
// 	} catch (error) {
// 		console.error('Registration error:', error);
// 		return { message: 'Failed to register. Please try again.' };
// 	}
// }

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
