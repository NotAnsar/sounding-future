'use server';

import { z } from 'zod';
import { State } from './utils';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const imageSchema = z.object({
	file: z
		.any()
		.refine((file: File) => file?.size !== 0, 'File is required')
		.refine(
			(file: File) => file.size < MAX_FILE_SIZE,
			`Max size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.`
		)
		.refine(
			(file: File) => checkFileType(file),
			'Only .png, .jpg, .jpeg formats are supported.'
		),
});

const checkFileType = (file: File) => {
	const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
	return allowedTypes.includes(file.type);
};

const PartnerSchema = z.object({
	name: z
		.string()
		.min(1, 'Partner name is required')
		.max(100, 'Partner name must be 100 characters or less'),
	info: z
		.string()
		.max(500, 'Partner must be 500 characters or less')
		.optional(),
	image: imageSchema.shape.file,
	country: z
		.string()
		.min(1, 'Country is required')
		.max(100, 'Country must be 100 characters or less'),
	studioPic: imageSchema.shape.file.optional(),
	website: z.string().url('Invalid website URL').optional(),
	facebook: z.string().url('Invalid Facebook URL').optional(),
	instagram: z.string().url('Invalid Instagram URL').optional(),
	vimeo: z.string().url('Invalid Vimeo URL').optional(),
	linkedin: z.string().url('Invalid LinkedIn URL').optional(),
	youtube: z.string().url('Invalid YouTube URL').optional(),
});

type PartnerData = z.infer<typeof PartnerSchema>;

export type PartnerFormState = State<PartnerData>;

export async function addPartner(
	prevState: PartnerFormState,
	formData: FormData
): Promise<PartnerFormState> {
	const validatedFields = PartnerSchema.safeParse({
		name: formData.get('name'),
		info: formData.get('info'),
		image: formData.get('image'),
		country: formData.get('country'),
		studioPic: formData.get('studioPic'),
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Failed to add new Partner. Please check the form for errors.',
		};
	}

	const { name, info, image, country, studioPic } = validatedFields.data;

	try {
		// Example image upload logic (replace with your actual implementation)
		console.log(`Uploading image: ${(image as File).name}`);
		// const imageUrl = await uploadImageToStorage(image.file)
		// await updateUserProfileImage(userId, imageUrl)

		if (studioPic && studioPic.size > 0) {
			// Example studioPic upload logic (replace with your actual implementation)
			console.log(`Uploading studioPic: ${studioPic.name}`);
			// const studioPicUrl = await uploadStudioPicToStorage(studioPic)
			// await updateUserStudioPic(userId, studioPicUrl)
		}

		console.log(name, info, image, country, studioPic);

		// revalidatePath('/', 'layout');
		return { message: 'Partner added successfully' };
	} catch (error) {
		console.error('Partner creation error:', error);
		return { message: 'Failed to adding new partner. Please try again.' };
	}
}
