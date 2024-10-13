'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Define the schema for profile update
const ProfileSchema = z.object({
	name: z
		.string()
		.min(1, 'Artist name is required')
		.max(100, 'Artist name must be 100 characters or less'),
	biography: z
		.string()
		.max(500, 'Biography must be 500 characters or less')
		.optional(),
	genres: z.array(z.string()).max(3, 'You can only select up to 3 genre tags'),
	image: z.instanceof(File).optional(),
});

export type ProfileFormState = {
	errors?: {
		name?: string[];
		biography?: string[];
		genres?: string[];
		image?: string[];
	};
	message?: string | null;
};

export async function updateProfile(
	prevState: ProfileFormState,
	formData: FormData
): Promise<ProfileFormState> {
	const genresData = formData
		.getAll('genres')
		.filter((genre) => genre !== '') as string[];
	const validatedFields = ProfileSchema.safeParse({
		name: formData.get('name'),
		biography: formData.get('biography'),
		genres: genresData,
		image: formData.get('image'),
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Failed to update profile. Please check the form for errors.',
		};
	}

	const { name, biography, genres, image } = validatedFields.data;

	try {
		// Here you would typically update the user's profile in your database
		// For the image, you'd upload it to a file storage service

		if (image && image.size > 0) {
			// Example image upload logic (replace with your actual implementation)
			console.log(`Uploading image: ${image.name}`);
			// const imageUrl = await uploadImageToStorage(image)
			// await updateUserProfileImage(userId, imageUrl)
		}
		console.log(name, biography, image, genres);

		// Example profile update logic (replace with your actual implementation)
		// await updateUserProfile(userId, { name, biography, genres })

		revalidatePath('/', 'layout');
		return { message: 'Profile updated successfully' };
	} catch (error) {
		console.error('Profile update error:', error);
		return { message: 'Failed to update profile. Please try again.' };
	}
}
