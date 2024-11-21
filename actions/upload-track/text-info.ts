'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { State } from '../utils/utils';
import { redirect } from 'next/navigation';

const UploadTrackTextInfoSchema = z.object({
	articleLink: z.string().url('Invalid Article URL').optional(),
	trackInfo: z
		.string()
		.min(3, 'Track Info must be 3 characters or more')
		.max(500, 'Track Info must be 500 characters or less'),
	more: z.string().max(300, 'More must be 300 characters or less'),
});

type UploadTrackTextInfoData = z.infer<typeof UploadTrackTextInfoSchema>;

export type TextInfoState = State<UploadTrackTextInfoData>;

export async function addTrackTextInfo(
	id: string,
	prevState: TextInfoState,
	formData: FormData
): Promise<TextInfoState> {
	const validatedFields = UploadTrackTextInfoSchema.safeParse({
		articleLink: formData.get('articleLink') || undefined,
		trackInfo: formData.get('trackInfo'),
		more: formData.get('more'),
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Failed to upload track info. Please check the form for errors.',
		};
	}

	const { articleLink, more, trackInfo } = validatedFields.data;

	try {
		console.log('Text info:', { articleLink, more, trackInfo, id });

		revalidatePath('/', 'layout');
	} catch (error) {
		console.error('Profile update error:', error);
		return { message: 'Failed to upload track info. Please try again.' };
	}

	redirect(`/user/tracks/upload/${id}/audio`);
}
