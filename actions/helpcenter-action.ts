'use server';

import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { State, videoallowedTypes, videoSchema } from './utils/utils';
import {
	checkFile,
	deleteFile,
	updateFile,
	uploadFile,
} from './utils/s3-image';
import { redirect } from 'next/navigation';

const formSchema = z.object({
	title: z.string().min(2, 'Title must be at least 2 characters').trim(),
	description: z.string().min(2, 'Description is required').trim(),
	videoUrl: videoSchema.shape.file,

	published: z.boolean().default(false),
	isNewUserVideo: z.boolean().default(false),
});

type HelpCenterVideoData = z.infer<typeof formSchema>;

export type HelpCenterVideoState =
	| (State<HelpCenterVideoData> & { prev?: { videoUrl?: string | undefined } })
	| undefined;

export async function createHelpCenterVideo(
	prevState: HelpCenterVideoState,
	formData: FormData
): Promise<HelpCenterVideoState> {
	const validatedFields = formSchema.safeParse({
		title: formData.get('title'),
		description: formData.get('description'),
		videoUrl: formData.get('videoUrl'),
		published: formData.get('published') === 'true',
		isNewUserVideo: formData.get('isNewUserVideo') === 'true',
	});

	if (!validatedFields.success) {
		console.log(validatedFields.error.flatten().fieldErrors);

		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Invalid data. Unable to create help center video.',
		};
	}
	const { videoUrl, ...rest } = validatedFields.data;

	try {
		const videoFileUrl = await uploadFile(videoUrl, 'video');

		await prisma.helpCenterVideo.create({
			data: { ...rest, videoUrl: videoFileUrl },
		});
		revalidatePath('/', 'layout');
	} catch (error) {
		return { message: 'Failed to create help center video' };
	}
	redirect('/user/sections/help-center');
}

export async function updateHelpCenterVideo(
	id: string,
	prevState: HelpCenterVideoState,
	formData: FormData
) {
	const validatedFields = formSchema.omit({ videoUrl: true }).safeParse({
		title: formData.get('title'),
		description: formData.get('description'),
		published: formData.get('published') === 'true',
		isNewUserVideo: formData.get('isNewUserVideo') === 'true',
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Invalid data. Unable to update help center video.',
		};
	}

	try {
		const videoFile = await checkFile(formData.get('videoUrl'));

		if (videoFile instanceof File) {
			if (videoFile.size > 200 * 1024 * 1024) {
				return {
					message: 'Video file must be less than 200MB',
					errors: { videoUrl: ['Video file must be less than 200MB'] },
				};
			}
			if (!videoallowedTypes.includes(videoFile?.type)) {
				return {
					message: 'Only .mp4, .webm, .mov, and .avi formats are supported.',
					errors: {
						videoUrl: [
							'Only .mp4, .webm, .mov, and .avi formats are supported.',
						],
					},
				};
			}
		}

		const videoFileUrl = await updateFile(
			videoFile || null,
			prevState?.prev?.videoUrl,
			'video'
		);

		await prisma.helpCenterVideo.update({
			where: { id },
			data: { ...validatedFields.data, videoUrl: videoFileUrl },
		});
		revalidatePath('/', 'layout');
	} catch (error) {
		return { message: 'Failed to update help center video' };
	}
	redirect('/user/sections/help-center');
}

export type DeleteHelpCenterVideoState = {
	message?: string | null;
	success?: boolean;
};

export async function deleteHelpCenterVideo(
	id: string
): Promise<DeleteHelpCenterVideoState> {
	try {
		const video = await prisma.helpCenterVideo.delete({ where: { id } });
		if (video.thumbnailUrl) await deleteFile(video.thumbnailUrl);

		if (video.videoUrl) await deleteFile(video.videoUrl);

		revalidatePath('/', 'layout');
		return { success: true, message: 'Help center video deleted successfully' };
	} catch (error) {
		console.error('Delete error:', error);

		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			return {
				success: false,
				message: 'Help center video not found or cannot be deleted',
			};
		}

		return { success: false, message: 'Failed to delete help center video' };
	}
}

export async function reorderHelpCenterVideos(
	updates: { id: string; displayOrder: number }[]
) {
	try {
		await prisma.$transaction(
			updates.map((update) =>
				prisma.helpCenterVideo.update({
					where: { id: update.id },
					data: { displayOrder: update.displayOrder },
				})
			)
		);

		revalidatePath('/user/sections/help-center');
		return { success: true };
	} catch (error) {
		console.error('Failed to reorder help center videos:', error);
		return { success: false, error: 'Failed to reorder help center videos' };
	}
}
