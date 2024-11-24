'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { State } from '../utils/utils';
import { checkFile, updateFile } from '../utils/s3-image';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

const audioFile = z
	.instanceof(File, { message: 'Audio file is required' })
	.refine((file) => file?.type.startsWith('audio/'), 'Must be in audio format')
	.refine((file) => file?.size <= 50 * 1024 * 1024, 'Must be less than 50MB');

const UploadAudioSchema = z.object({
	variant1: audioFile.optional(),
	variant2: audioFile.optional(),
	variant3: audioFile.optional(),
	published: z.boolean().default(false),
});

type UploadAudioData = z.infer<typeof UploadAudioSchema>;

export type AudioUploadState = State<UploadAudioData> & {
	prev?: { variant1?: string; variant2?: string; variant3?: string };
};

export async function uploadTrackInfo(
	id: string,
	prevState: AudioUploadState,
	formData: FormData
): Promise<AudioUploadState> {
	const validatedFields = UploadAudioSchema.safeParse({
		variant1: await checkFile(formData.get('variant1')),
		variant2: await checkFile(formData.get('variant2')),
		variant3: await checkFile(formData.get('variant3')),
		published: formData.get('published') === 'true',
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Failed to upload files. Please check the form for errors.',
		};
	}

	const { variant1, published } = validatedFields.data;

	if (!variant1 && !prevState.prev?.variant1) {
		return {
			errors: { variant1: ['Variant 1 file is required'] },
		};
	}

	try {
		const variant1Url = await updateFile(
			formData.get('variant1'),
			prevState?.prev?.variant1,
			'audio'
		);
		const variant2Url = await updateFile(
			formData.get('variant2'),
			prevState?.prev?.variant2,
			'audio'
		);
		const variant3Url = await updateFile(
			formData.get('variant3'),
			prevState?.prev?.variant3,
			'audio'
		);

		await prisma.track.update({
			where: { id },
			data: {
				published,
				variant1: variant1Url,
				variant2: variant2Url,
				variant3: variant3Url,
			},
		});

		revalidatePath('/', 'layout');
	} catch (error) {
		console.error('Upload error:', error);
		return { message: 'Failed to upload files. Please try again.' };
	}
	redirect('/user/tracks');
}
