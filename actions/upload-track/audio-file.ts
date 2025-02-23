'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { State } from '../utils/utils';
import { checkFile, deleteFile, updateFile } from '../utils/s3-image';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

const audioFile = z
	.instanceof(File, { message: 'Audio file is required' })
	.refine(
		(file) => file?.type.startsWith('audio/') || file?.type === 'video/webm',
		'Must be in audio or .webm format'
	)
	.refine((file) => file?.size <= 50 * 1024 * 1024, 'Must be less than 50MB');

const UploadAudioSchema = z.object({
	variant1: audioFile.optional(),
	variant2: audioFile.optional(),
	variant3: audioFile.optional(),
	published: z.boolean().default(false),
});

type UploadAudioData = z.infer<typeof UploadAudioSchema>;

export type AudioUploadState = State<UploadAudioData>;
// & {
// 	prev?: { variant1?: string; variant2?: string; variant3?: string };
// };

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

	const { published, variant1, variant2, variant3 } = validatedFields.data;

	try {
		const track = await prisma.track.findUnique({
			where: { id },
			include: { artist: true },
		});

		if (!track) {
			return { message: 'Track not found' };
		}

		if (
			!track.variant1 &&
			!track.variant2 &&
			!track.variant3 &&
			!variant1 &&
			!variant2 &&
			!variant3
		) {
			return { message: 'At least one audio variant is required.' };
		}

		const variant1Name = variant1?.name;
		const variant2Name = variant2?.name;
		const variant3Name = variant3?.name;

		const variant1Url = await updateFile(
			formData.get('variant1'),
			track?.variant1 || undefined,
			'audio',
			`${track.artist.id}-${track.id}-${track.artist.slug}-${track.slug}-bin`
		);

		const variant2Url = await updateFile(
			formData.get('variant2'),
			track?.variant2 || undefined,
			'audio',
			`${track.artist.id}-${track.id}-${track.artist.slug}-${track.slug}-bin-plus`
		);
		const variant3Url = await updateFile(
			formData.get('variant3'),
			track?.variant3 || undefined,
			'audio',
			`${track.artist.id}-${track.id}-${track.artist.slug}-${track.slug}-stereo`
		);

		await prisma.track.update({
			where: { id },
			data: {
				published,
				variant1: variant1Url,
				variant1Name: variant1 ? variant1Name : undefined,
				variant2: variant2Url,
				variant2Name: variant2 ? variant2Name : undefined,
				variant3: variant3Url,
				variant3Name: variant3 ? variant3Name : undefined,
			},
		});

		revalidatePath('/', 'layout');
	} catch (error) {
		console.error('Upload error:', error);
		return { message: 'Failed to upload files. Please try again.' };
	}

	redirect('/user/tracks');
}

export async function deleteTrackVariant(formData: FormData) {
	const trackId = formData.get('trackId') as string;
	const variant = formData.get('variant') as
		| 'variant1'
		| 'variant2'
		| 'variant3';

	try {
		const track = await prisma.track.findUnique({ where: { id: trackId } });
		if (!track) return { error: 'Track not found' };

		const url = track[variant];

		await prisma.track.update({
			where: { id: trackId },
			data: { [variant]: null, [`${variant}Name`]: null },
		});

		if (url) await deleteFile(url);

		// Check if all variants are now empty
		const updatedTrack = await prisma.track.findUnique({
			where: { id: trackId },
			select: {
				variant1: true,
				variant2: true,
				variant3: true,
				published: true,
			},
		});

		if (!updatedTrack) return { error: 'Track not found after update' };

		// Unpublish if no variants left
		if (
			!updatedTrack.variant1 &&
			!updatedTrack.variant2 &&
			!updatedTrack.variant3
		) {
			await prisma.track.update({
				where: { id: trackId },
				data: { published: false },
			});
		}

		revalidatePath('/');
		return { success: true };
	} catch (error) {
		console.error('Delete error:', error);
		return { success: false, message: 'Failed to delete track variant' };
	}
}
