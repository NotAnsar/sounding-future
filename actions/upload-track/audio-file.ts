'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { State } from '../utils';

const UploadImageSchema = z.object({
	sourceFormat: z.string().min(1, { message: 'La ville est requise' }),
	mp3File: z
		.instanceof(File)
		.refine((file) => {
			return file.type === 'audio/mpeg' || file.type === '.mp3';
		}, 'Mp3 File must be in mp3 or mpeg format')
		.refine((file) => {
			return file.size <= 50 * 1024 * 1024;
		}, 'Mp3 File must be less than 50MB'),
	flacFile: z.instanceof(File).optional(), 
	imageFile: z
		.instanceof(File)
		.refine((file) => {
			return file.type === 'image/jpeg' || file.type === 'image/jpg';
		}, 'Image must be in JPG format')
		.refine((file) => {
			return file.size <= 5 * 1024 * 1024;
		}, 'Image must be less than 5MB'),
});

type UploadImageData = z.infer<typeof UploadImageSchema>;

export type ImageUploadState = State<UploadImageData>;

export async function uploadTrackInfo(
	prevState: ImageUploadState,
	formData: FormData
): Promise<ImageUploadState> {
	const validatedFields = UploadImageSchema.safeParse({
		sourceFormat: formData.get('sourceFormat'),
		mp3File:
			(formData.get('mp3File') as File).size === 0
				? undefined
				: formData.get('mp3File'),
		flacFile:
			(formData.get('flacFile') as File).size === 0
				? undefined
				: formData.get('flacFile'),
		imageFile: formData.get('imageFile'),
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Failed to upload files. Please check the form for errors.',
		};
	}

	const { sourceFormat, mp3File, flacFile, imageFile } = validatedFields.data;

	try {
		console.log('Uploading files:', {
			sourceFormat,
			mp3File,
			flacFile,
			imageFile,
		});

		revalidatePath('/', 'layout');
		return { message: 'Files uploaded successfully' };
	} catch (error) {
		console.error('Upload error:', error);
		return { message: 'Failed to upload files. Please try again.' };
	}
}
