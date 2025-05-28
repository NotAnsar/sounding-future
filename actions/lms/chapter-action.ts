'use server';

import { z } from 'zod';
import {
	State,
	videoSchema,
	imageSchema,
	downloadSchema,
	generateSlug,
} from '@/actions/utils/utils';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {
	checkFile,
	deleteFile,
	updateFile,
	uploadFile,
	uploadDownloadFiles,
	deleteDownloadFiles,
} from '@/actions/utils/s3-image';

// Define Chapter schema for validation - matching Prisma schema
const ChapterSchema = z.object({
	title: z
		.string()
		.min(1, 'Chapter title is required')
		.max(200, 'Chapter title must be 200 characters or less'),
	description: z.string().optional(),
	videoUrl: videoSchema.shape.file.optional(),
	videoDuration: z.number().min(0, 'Duration must be positive').optional(),
	thumbnail: imageSchema.shape.file.optional(),
	downloads: z.array(downloadSchema.shape.file).optional(),
	courseId: z.string().min(1, 'Course is required'),
	instructorIds: z
		.array(z.string())
		.min(1, 'At least one instructor is required'),
	accessType: z.string().default('PRO'),
	published: z.boolean().default(false),
	position: z.number().min(1, 'Position must be at least 1'),
});

type ChapterData = z.infer<typeof ChapterSchema>;

export type ChapterFormState = State<ChapterData> & {
	prev?: {
		videoUrl?: string | undefined;
		thumbnail?: string | undefined;
		downloads?: string[] | undefined;
	};
};

export type DeleteChapterState = {
	message?: string | null;
	success?: boolean;
};

// Helper function to get next position for chapter
async function getNextChapterPosition(courseId: string): Promise<number> {
	const lastChapter = await prisma.chapter.findFirst({
		where: { courseId },
		orderBy: { position: 'desc' },
		select: { position: true },
	});

	return (lastChapter?.position || 0) + 1;
}

// Helper function to validate video requirement for publishing
function validateVideoForPublishing(
	published: boolean,
	hasNewVideo: boolean,
	existingVideoUrl?: string
): { isValid: boolean; error?: string } {
	if (published && !hasNewVideo && !existingVideoUrl) {
		return {
			isValid: false,
			error:
				'Cannot publish chapter without a video. Please upload a video first.',
		};
	}
	return { isValid: true };
}

// Helper function to check and update course publish status
async function updateCoursePublishStatus(
	courseId: string,
	wasChapterUnpublished: boolean
): Promise<void> {
	// Only check if a chapter was unpublished
	if (!wasChapterUnpublished) return;

	try {
		// Check if course has any published chapters
		const publishedChaptersCount = await prisma.chapter.count({
			where: {
				courseId: courseId,
				published: true,
			},
		});

		// If no published chapters, unpublish the course
		if (publishedChaptersCount === 0) {
			await prisma.course.update({
				where: { id: courseId },
				data: { published: false },
			});
		}
	} catch (error) {
		console.error('Error updating course publish status:', error);
		// Don't throw error - this is a secondary operation
	}
}

function getDeletedDownloads(formData: FormData): string[] {
	const deletedUrls: string[] = [];
	const entries = Array.from(formData.entries());

	for (const [key, value] of entries) {
		if (key.startsWith('deleteDownloads[') && typeof value === 'string') {
			deletedUrls.push(value);
		}
	}

	return deletedUrls;
}

// Helper function to process download files from FormData
function getDownloadFiles(formData: FormData): File[] {
	const files: File[] = [];

	// Get all values for the 'downloads' key
	const downloadEntries = formData.getAll('downloads');

	for (const entry of downloadEntries) {
		if (entry instanceof File && entry.size > 0) {
			files.push(entry);
		}
	}

	return files;
}

export async function addChapter(
	prevState: ChapterFormState,
	formData: FormData
): Promise<ChapterFormState> {
	const courseId = formData.get('courseId')?.toString();
	const published = formData.get('published') === 'true';

	if (!courseId) {
		return {
			errors: { courseId: ['Course is required'] },
			message: 'Course is required',
		};
	}

	// Get instructor IDs from form data
	const instructorIds = formData.getAll('instructorIds') as string[];

	if (instructorIds.length === 0) {
		return {
			errors: { instructorIds: ['At least one instructor is required'] },
			message: 'At least one instructor is required',
		};
	}

	// Check if video file is provided
	const videoFile = await checkFile(formData.get('videoUrl'));

	// Validate video requirement for publishing
	const videoValidation = validateVideoForPublishing(published, !!videoFile);
	if (!videoValidation.isValid) {
		return {
			errors: { published: [videoValidation.error!] },
			message: videoValidation.error!,
		};
	}

	// Get download files
	const downloadFiles = getDownloadFiles(formData);

	// Get next position
	const position = await getNextChapterPosition(courseId);

	const validatedFields = ChapterSchema.safeParse({
		title: formData.get('title') || undefined,
		description: formData.get('description') || undefined,
		videoUrl: videoFile,
		videoDuration: formData.get('videoDuration')
			? Number(formData.get('videoDuration'))
			: undefined,
		thumbnail: await checkFile(formData.get('thumbnail')),
		downloads: downloadFiles,
		courseId: courseId,
		instructorIds: instructorIds,
		accessType: formData.get('accessType') || 'PRO',
		published: published,
		position: position,
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Failed to create chapter. Please check the form for errors.',
		};
	}

	const {
		videoUrl,
		thumbnail,
		downloads,
		instructorIds: validatedInstructorIds,
		...otherData
	} = validatedFields.data;

	try {
		// Upload video if provided
		const videoFileUrl = videoUrl ? await uploadFile(videoUrl, 'video') : null;

		// Upload thumbnail if provided
		const thumbnailUrl = thumbnail ? await uploadFile(thumbnail) : null;

		// Upload download files if provided
		const downloadUrls =
			downloads && downloads.length > 0
				? await uploadDownloadFiles(downloads)
				: [];

		const { title } = otherData;
		const slug = generateSlug(title);

		// Create chapter with instructor relationships
		await prisma.chapter.create({
			data: {
				...otherData,
				videoUrl: videoFileUrl,
				thumbnail: thumbnailUrl,
				downloads: downloadUrls,
				slug,
				instructors: {
					create: validatedInstructorIds.map((instructorId) => ({
						instructorId: instructorId,
					})),
				},
			},
		});

		revalidatePath('/user/lms/chapters');
		revalidatePath('/user/lms'); // Also revalidate courses list
	} catch (error) {
		console.error('Create chapter error:', error);
		return { message: 'Failed to create chapter' };
	}

	redirect('/user/lms/chapters');
}

export async function updateChapter(
	id: string,
	prevState: ChapterFormState,
	formData: FormData
): Promise<ChapterFormState> {
	const published = formData.get('published') === 'true';
	const deleteVideo = formData.get('deleteVideo') === 'true';

	// Get instructor IDs from form data
	const instructorIds = formData.getAll('instructorIds') as string[];

	if (instructorIds.length === 0) {
		return {
			errors: { instructorIds: ['At least one instructor is required'] },
			message: 'At least one instructor is required',
		};
	}

	// Check if new video file is provided
	const videoFile = await checkFile(formData.get('videoUrl'));
	const existingVideoUrl = prevState?.prev?.videoUrl;

	// Determine final video state after operations
	let willHaveVideo = false;
	if (deleteVideo) {
		// Video is being deleted
		willHaveVideo = !!videoFile; // Only if new video is uploaded
	} else {
		// Video is not being deleted
		willHaveVideo = !!videoFile || !!existingVideoUrl;
	}

	// Validate video requirement for publishing
	if (published && !willHaveVideo) {
		return {
			errors: {
				published: [
					'Cannot publish chapter without a video. Please upload a video first.',
				],
			},
			message: 'Cannot publish chapter without a video.',
		};
	}

	// Get download files and deleted downloads
	const downloadFiles = getDownloadFiles(formData);
	const deletedDownloadUrls = getDeletedDownloads(formData);

	const validatedFields = ChapterSchema.omit({
		position: true,
		videoUrl: true,
		thumbnail: true,
		downloads: true,
	}).safeParse({
		title: formData.get('title'),
		description: formData.get('description') || undefined,
		videoDuration: formData.get('videoDuration')
			? Number(formData.get('videoDuration'))
			: undefined,
		courseId: formData.get('courseId'),
		instructorIds: instructorIds,
		accessType: formData.get('accessType') || 'PRO',
		published: published,
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Failed to update chapter. Please check the form for errors.',
		};
	}

	const { instructorIds: validatedInstructorIds, ...updateData } =
		validatedFields.data;

	try {
		// Get current chapter state to check if it's being unpublished
		const currentChapter = await prisma.chapter.findUnique({
			where: { id },
			select: {
				published: true,
				courseId: true,
				videoUrl: true,
				downloads: true,
			},
		});

		const wasPublished = currentChapter?.published || false;
		const isBeingUnpublished = wasPublished && !published;

		let finalVideoUrl = currentChapter?.videoUrl;

		// Handle video deletion
		if (deleteVideo && currentChapter?.videoUrl) {
			await deleteFile(currentChapter.videoUrl);
			finalVideoUrl = null;
		}

		// Handle new video upload
		if (videoFile) {
			// If there was an existing video and we're not deleting it, update it
			if (finalVideoUrl && !deleteVideo) {
				finalVideoUrl = await updateFile(videoFile, finalVideoUrl, 'video');
			} else {
				// Upload new video
				finalVideoUrl = await uploadFile(videoFile, 'video');
			}
		}

		// Handle thumbnail update
		const thumbnailFile = formData.get('thumbnail');
		const thumbnailUrl = await updateFile(
			thumbnailFile,
			prevState?.prev?.thumbnail
		);

		// Handle downloads update
		let finalDownloads = currentChapter?.downloads || [];

		// Remove deleted downloads
		if (deletedDownloadUrls.length > 0) {
			// Delete files from S3
			await deleteDownloadFiles(deletedDownloadUrls);
			// Remove from the array
			finalDownloads = finalDownloads.filter(
				(url) => !deletedDownloadUrls.includes(url)
			);
		}

		// Add new download files
		if (downloadFiles.length > 0) {
			const newDownloadUrls = await uploadDownloadFiles(downloadFiles);
			finalDownloads = [...finalDownloads, ...newDownloadUrls];
		}

		const { title } = updateData;
		const slug = generateSlug(title);
		// Update chapter and instructor relationships
		await prisma.chapter.update({
			where: { id },
			data: {
				...updateData,
				videoUrl: finalVideoUrl,
				thumbnail: thumbnailUrl,
				downloads: finalDownloads,
				slug,
				instructors: {
					// Delete existing relationships
					deleteMany: {},
					// Create new relationships
					create: validatedInstructorIds.map((instructorId) => ({
						instructorId: instructorId,
					})),
				},
			},
		});

		// Check if course should be unpublished
		if (currentChapter?.courseId) {
			await updateCoursePublishStatus(
				currentChapter.courseId,
				isBeingUnpublished
			);
		}

		revalidatePath('/user/lms/chapters');
		revalidatePath('/user/lms'); // Also revalidate courses list
	} catch (error) {
		console.error('Update chapter error:', error);
		return { message: 'Failed to update chapter' };
	}

	redirect('/user/lms/chapters');
}

export async function deleteChapter(id: string): Promise<DeleteChapterState> {
	try {
		const chapter = await prisma.chapter.findUnique({
			where: { id },
			select: {
				videoUrl: true,
				thumbnail: true,
				downloads: true,
				courseId: true,
				published: true,
			},
		});

		if (!chapter) {
			return { success: false, message: 'Chapter not found' };
		}

		const wasPublished = chapter.published;

		await prisma.chapter.delete({ where: { id } });

		// Delete associated files
		if (chapter?.videoUrl) {
			await deleteFile(chapter.videoUrl);
		}
		if (chapter?.thumbnail) {
			await deleteFile(chapter.thumbnail);
		}
		if (chapter?.downloads && chapter.downloads.length > 0) {
			await deleteDownloadFiles(chapter.downloads);
		}

		// Check if course should be unpublished (if deleted chapter was published)
		if (chapter.courseId) {
			await updateCoursePublishStatus(chapter.courseId, wasPublished);
		}

		revalidatePath('/user/lms', 'layout'); // Also revalidate courses list
		return { success: true, message: 'Chapter deleted successfully' };
	} catch (error) {
		console.error('Delete chapter error:', error);
		return { success: false, message: 'Failed to delete chapter' };
	}
}
