'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { State } from '../utils';

const UploadTrackTextInfoSchema = z.object({
	articleLink: z.string().url('Invalid Article URL').optional().nullable(),
	trackInfo: z
		.string()
		.max(500, 'Track Info must be 500 characters or less')
		.optional(),
	more: z.string().max(300, 'More must be 300 characters or less').optional(),
});

type UploadTrackTextInfoData = z.infer<typeof UploadTrackTextInfoSchema>;

export type TextInfoState = State<UploadTrackTextInfoData>;

export async function addTrackTextInfo(
	prevState: TextInfoState,
	formData: FormData
): Promise<TextInfoState> {
	const validatedFields = UploadTrackTextInfoSchema.safeParse({
		articleLink: formData.get('articleLink'),
		trackInfo: formData.get('trackInfo'),
		more: formData.get('more'),
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Failed to update profile. Please check the form for errors.',
		};
	}

	const { articleLink, more, trackInfo } = validatedFields.data;

	try {
		console.log('Text info:', { articleLink, more, trackInfo });

		revalidatePath('/', 'layout');
		return { message: 'Text Info updated successfully' };
	} catch (error) {
		console.error('Profile update error:', error);
		return { message: 'Failed to update profile. Please try again.' };
	}
}
