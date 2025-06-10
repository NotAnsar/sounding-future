'use server';

import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import {
	imageSchema,
	State,
	videoallowedTypes,
	videoSchema,
} from './utils/utils';
import {
	checkFile,
	deleteFile,
	deleteHLSFolder,
	updateFile,
	uploadFile,
	uploadHLSFiles,
} from './utils/s3-image';
import { redirect } from 'next/navigation';

// Helper function to process HLS files from FormData
function getHLSFiles(formData: FormData): File[] {
	const files: File[] = [];

	// Get all values for the 'hlsFiles' key
	const hlsEntries = formData.getAll('hlsFiles');

	for (const entry of hlsEntries) {
		if (entry instanceof File && entry.size > 0) {
			files.push(entry);
		}
	}

	return files;
}

const formSchema = z.object({
	title: z.string().min(2, 'Title must be at least 2 characters').trim(),
	description: z.string().min(2, 'Description is required').trim(),
	videoUrl: videoSchema.shape.file,
	thumbnailUrl: imageSchema.shape.file.optional(),
	published: z.boolean().default(false),
	isNewUserVideo: z.boolean().default(false),
});

type HelpCenterVideoData = z.infer<typeof formSchema> & { hlsUrl: string };

export type HelpCenterVideoState =
	| (State<HelpCenterVideoData> & {
			prev?: {
				videoUrl?: string | undefined;
				thumbnailUrl?: string | undefined;
				hlsUrl?: string | undefined;
			};
	  })
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
		thumbnailUrl: await checkFile(formData.get('thumbnailUrl')),
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Invalid data. Unable to create help center video.',
		};
	}

	const hlsFiles = getHLSFiles(formData);
	const { videoUrl, thumbnailUrl: thumbnail, ...rest } = validatedFields.data;

	try {
		const videoFileUrl = await uploadFile(videoUrl, 'video');

		let hlsFileUrl = null;
		if (hlsFiles.length > 0) {
			try {
				hlsFileUrl = await uploadHLSFiles(hlsFiles);
				console.info('✅ HLS upload successful:', hlsFileUrl);
			} catch (error) {
				console.error('❌ HLS upload failed:', error);
				return {
					errors: { hlsUrl: ['Failed to upload HLS files'] },
					message: 'Failed to upload HLS files: ',
				};
			}
		}

		const thumbnailUrl = thumbnail ? await uploadFile(thumbnail) : undefined;

		await prisma.helpCenterVideo.create({
			data: {
				...rest,
				videoUrl: videoFileUrl,
				thumbnailUrl,
				hlsUrl: hlsFileUrl,
			},
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
	const deleteHls = formData.get('deleteHls') === 'true';

	const validatedFields = formSchema
		.omit({ videoUrl: true, thumbnailUrl: true })
		.safeParse({
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
	let finalHlsUrl = prevState?.prev?.hlsUrl || null;
	const hlsFiles = getHLSFiles(formData);

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

		if (deleteHls && finalHlsUrl) {
			try {
				await deleteHLSFolder(finalHlsUrl);
				console.info('✅ HLS folder deleted successfully');
			} catch (error) {
				console.error('❌ Failed to delete HLS folder:', error);
				// Continue anyway - don't fail the whole operation
			}
			finalHlsUrl = null;
		}

		if (hlsFiles.length > 0) {
			if (finalHlsUrl && !deleteHls) {
				// Delete old HLS files first
				try {
					console.info('🗑️ Deleting old HLS files...');
					await deleteHLSFolder(finalHlsUrl);
				} catch (error) {
					console.warn('Failed to delete old HLS files:', error);
					// Continue anyway
				}
			}

			try {
				finalHlsUrl = await uploadHLSFiles(hlsFiles);
				console.info('✅ HLS upload successful:', finalHlsUrl);
			} catch (error) {
				console.error('❌ HLS upload failed:', error);
				return {
					errors: { hlsUrl: ['Failed to upload HLS files'] },
					message: 'Failed to upload HLS files: ',
				};
			}
		}

		const thumbnail = formData.get('thumbnailUrl');

		if (thumbnail instanceof File && thumbnail.size > 2 * 1024 * 1024) {
			return {
				message: 'Thumbnail image must be less than 2MB',
				errors: { backgroundImage: ['Thumbnail image must be less than 2MB'] },
			};
		}

		const thumbnailUrl = await updateFile(
			thumbnail,
			prevState?.prev?.thumbnailUrl
		);

		await prisma.helpCenterVideo.update({
			where: { id },
			data: {
				...validatedFields.data,
				videoUrl: videoFileUrl,
				thumbnailUrl,
				hlsUrl: finalHlsUrl,
			},
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
		if (video?.hlsUrl) {
			try {
				await deleteHLSFolder(video.hlsUrl);
			} catch (error) {}
		}

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
