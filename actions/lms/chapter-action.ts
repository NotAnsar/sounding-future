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
	uploadHLSFiles,
	deleteHLSFolder, // ADD THIS IMPORT
} from '@/actions/utils/s3-image';

// Define marker schema for validation
const MarkerSchema = z.object({
	id: z.string(),
	timestamp: z.number().min(0, 'Timestamp must be positive'),
	title: z.string().min(1, 'Marker title is required'),
	description: z.string().optional(),
	position: z.number().min(1, 'Position must be at least 1'),
});

// Define Chapter schema for validation - matching Prisma schema
const ChapterSchema = z.object({
	title: z
		.string()
		.min(1, 'Chapter title is required')
		.max(200, 'Chapter title must be 200 characters or less'),
	description: z.string().optional(),
	videoUrl: videoSchema.shape.file.optional(),

	videoDuration: z
		.number()
		.min(0, 'Duration must be positive')
		.nullable()
		.optional(), // Made nullable

	thumbnail: imageSchema.shape.file.optional(),
	downloads: z.array(downloadSchema.shape.file).optional(),
	courseId: z.string().min(1, 'Course is required'),
	instructorIds: z
		.array(z.string())
		.min(1, 'At least one instructor is required'),
	accessType: z.string().default('PRO'),
	published: z.boolean().default(false),
	position: z.number().min(1, 'Position must be at least 1'),
	markers: z.array(MarkerSchema).optional(),
});

type ChapterData = z.infer<typeof ChapterSchema> & { hlsUrl: string };

export type ChapterFormState = State<ChapterData> & {
	prev?: {
		videoUrl?: string | undefined;
		hlsUrl?: string | undefined;
		thumbnail?: string | undefined;
		downloads?: string[] | undefined;
	};
};

export type DeleteChapterState = {
	message?: string | null;
	success?: boolean;
};

// Helper function to process markers from FormData
function getMarkersFromFormData(formData: FormData): Array<{
	id: string;
	timestamp: number;
	title: string;
	description?: string;
	position: number;
}> {
	const markers: Array<{
		id: string;
		timestamp: number;
		title: string;
		description?: string;
		position: number;
	}> = [];

	// Get all marker entries
	const entries = Array.from(formData.entries());
	const markerData: Record<string, Record<string, string>> = {};

	// Parse marker data from form
	for (const [key, value] of entries) {
		const match = key.match(/^markers\[(\d+)\]\[(\w+)\]$/);
		if (match) {
			const [, index, field] = match;
			if (!markerData[index]) {
				markerData[index] = {};
			}
			markerData[index][field] = value.toString();
		}
	}

	// Convert to array and validate
	for (const index in markerData) {
		const marker = markerData[index];
		if (marker.title && marker.title.trim()) {
			markers.push({
				id: marker.id,
				timestamp: parseInt(marker.timestamp) || 0,
				title: marker.title.trim(),
				description: marker.description?.trim() || undefined,
				position: parseInt(marker.position) || parseInt(index) + 1,
			});
		}
	}

	return markers;
}

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
	hasNewHls: boolean,
	existingVideoUrl?: string,
	existingHlsUrl?: string
): { isValid: boolean; error?: string } {
	if (
		published &&
		!hasNewVideo &&
		!hasNewHls &&
		!existingVideoUrl &&
		!existingHlsUrl
	) {
		return {
			isValid: false,
			error:
				'Cannot publish chapter without a video or HLS stream. Please upload a media file first.',
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
	const hlsFiles = getHLSFiles(formData);

	// Validate video requirement for publishing
	const videoValidation = validateVideoForPublishing(
		published,
		!!videoFile,
		hlsFiles.length > 0
	);
	if (!videoValidation.isValid) {
		return {
			errors: { published: [videoValidation.error!] },
			message: videoValidation.error!,
		};
	}

	// Get download files and markers
	const downloadFiles = getDownloadFiles(formData);
	const markers = getMarkersFromFormData(formData);

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
		markers: markers,
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
		videoDuration,
		instructorIds: validatedInstructorIds,
		markers: validatedMarkers,
		...otherData
	} = validatedFields.data;

	// Validate markers against video duration
	const markerValidation = validateMarkersAgainstDuration(
		markers,
		videoDuration || 0,
		!!(videoFile || hlsFiles.length > 0)
	);

	if (!markerValidation.isValid) {
		return {
			errors: { markers: markerValidation.errors },
			message: 'Invalid video markers. Please check marker timestamps.',
		};
	}

	try {
		// Upload video if provided
		const videoFileUrl = videoUrl ? await uploadFile(videoUrl, 'video') : null;

		// Upload HLS files if provided using specialized function
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

		// Upload thumbnail if provided
		const thumbnailUrl = thumbnail ? await uploadFile(thumbnail) : null;

		// Upload download files if provided
		const downloadUrls =
			downloads && downloads.length > 0
				? await uploadDownloadFiles(downloads)
				: [];

		const { title } = otherData;
		const slug = generateSlug(title);

		// Create chapter with instructor relationships and markers
		await prisma.chapter.create({
			data: {
				...otherData,
				videoDuration: videoDuration || null,
				videoUrl: videoFileUrl,
				hlsUrl: hlsFileUrl,
				thumbnail: thumbnailUrl,
				downloads: downloadUrls,
				slug,
				instructors: {
					create: validatedInstructorIds.map((instructorId) => ({
						instructorId: instructorId,
					})),
				},
				markers: {
					create:
						validatedMarkers
							?.filter((marker) => !marker.id.startsWith('temp-'))
							.map((marker) => ({
								timestamp: marker.timestamp,
								title: marker.title,
								description: marker.description,
								position: marker.position,
							})) || [],
				},
			},
		});

		revalidatePath('/user/lms', 'layout');
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
	const deleteHls = formData.get('deleteHls') === 'true';

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
	const hlsFiles = getHLSFiles(formData);

	// Get duration from form, but handle properly
	const formVideoDuration = formData.get('videoDuration');
	const newVideoDuration = formVideoDuration ? Number(formVideoDuration) : 0;

	// Get current chapter to check existing video duration
	const currentChapter = await prisma.chapter.findUnique({
		where: { id },
		select: {
			published: true,
			courseId: true,
			hlsUrl: true,
			videoUrl: true,
			downloads: true,
			videoDuration: true,
		},
	});

	if (!currentChapter) {
		return {
			message: 'Chapter not found',
		};
	}

	// Determine final video state and duration after operations
	let willHaveVideo = false;
	let finalVideoDuration: number | null = null;

	if (deleteVideo && deleteHls) {
		// Both are being deleted
		willHaveVideo = !!(videoFile || hlsFiles.length > 0);
		finalVideoDuration = willHaveVideo ? newVideoDuration : null;
	} else if (deleteVideo) {
		// Only video is being deleted
		if (hlsFiles.length > 0) {
			// New HLS files uploaded
			willHaveVideo = true;
			finalVideoDuration = newVideoDuration;
		} else if (currentChapter.hlsUrl) {
			// Existing HLS remains
			willHaveVideo = true;
			finalVideoDuration = newVideoDuration || currentChapter.videoDuration;
		} else if (videoFile) {
			// New video uploaded
			willHaveVideo = true;
			finalVideoDuration = newVideoDuration;
		} else {
			// No video at all
			willHaveVideo = false;
			finalVideoDuration = null;
		}
	} else if (deleteHls) {
		// Only HLS is being deleted
		if (videoFile) {
			// New video uploaded
			willHaveVideo = true;
			finalVideoDuration = newVideoDuration;
		} else if (currentChapter.videoUrl) {
			// Existing video remains
			willHaveVideo = true;
			finalVideoDuration = newVideoDuration || currentChapter.videoDuration;
		} else if (hlsFiles.length > 0) {
			// New HLS uploaded
			willHaveVideo = true;
			finalVideoDuration = newVideoDuration;
		} else {
			// No video at all
			willHaveVideo = false;
			finalVideoDuration = null;
		}
	} else {
		// Nothing is being deleted
		if (videoFile || hlsFiles.length > 0) {
			// New files uploaded
			willHaveVideo = true;
			finalVideoDuration = newVideoDuration;
		} else if (currentChapter.videoUrl || currentChapter.hlsUrl) {
			// Existing files remain
			willHaveVideo = true;
			finalVideoDuration = newVideoDuration || currentChapter.videoDuration;
		} else {
			// No video at all
			willHaveVideo = false;
			finalVideoDuration = null;
		}
	}

	// Validate video requirement for publishing
	if (published && !willHaveVideo) {
		return {
			errors: {
				published: [
					'Cannot publish chapter without a video or HLS stream. Please upload a media file first.',
				],
			},
			message: 'Cannot publish chapter without a video or HLS stream.',
		};
	}

	// Get download files, deleted downloads, and markers
	const downloadFiles = getDownloadFiles(formData);
	const deletedDownloadUrls = getDeletedDownloads(formData);
	const markers = getMarkersFromFormData(formData);

	// Validate markers against video duration
	const markerValidation = validateMarkersAgainstDuration(
		markers,
		finalVideoDuration || undefined,
		willHaveVideo
	);

	if (!markerValidation.isValid) {
		return {
			errors: { markers: markerValidation.errors },
			message: 'Invalid video markers. Please check marker timestamps.',
		};
	}

	const validatedFields = ChapterSchema.omit({
		position: true,
		videoUrl: true,
		thumbnail: true,
		downloads: true,
	}).safeParse({
		title: formData.get('title'),
		description: formData.get('description') || undefined,
		videoDuration: finalVideoDuration,
		courseId: formData.get('courseId'),
		instructorIds: instructorIds,
		accessType: formData.get('accessType') || 'PRO',
		published: published,
		markers: markers,
	});

	if (!validatedFields.success) {
		console.error(
			'Validation errors:',
			validatedFields.error.flatten().fieldErrors
		);
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Failed to update chapter. Please check the form for errors.',
		};
	}

	const {
		instructorIds: validatedInstructorIds,
		markers: validatedMarkers,
		videoDuration,
		...updateData
	} = validatedFields.data;

	try {
		const wasPublished = currentChapter.published || false;
		const isBeingUnpublished = wasPublished && !published;

		let finalVideoUrl = currentChapter.videoUrl;
		let finalHlsUrl = currentChapter.hlsUrl;

		// Handle video deletion
		if (deleteVideo && currentChapter.videoUrl) {
			await deleteFile(currentChapter.videoUrl);
			finalVideoUrl = null;
		}

		// Handle HLS deletion
		if (deleteHls && currentChapter.hlsUrl) {
			try {
				await deleteHLSFolder(currentChapter.hlsUrl);
				console.info('✅ HLS folder deleted successfully');
			} catch (error) {
				console.error('❌ Failed to delete HLS folder:', error);
				// Continue anyway - don't fail the whole operation
			}
			finalHlsUrl = null;
		}

		// Handle new video upload
		if (videoFile) {
			// If there was an existing video and we're not deleting it, update it
			if (finalVideoUrl && !deleteVideo) {
				finalVideoUrl =
					(await updateFile(videoFile, finalVideoUrl, 'video')) || null;
			} else {
				// Upload new video
				finalVideoUrl = await uploadFile(videoFile, 'video');
			}
		}

		// Handle new HLS upload using specialized function
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

		// Handle thumbnail update
		const thumbnailFile = formData.get('thumbnail');
		const thumbnailUrl = await updateFile(
			thumbnailFile,
			prevState?.prev?.thumbnail
		);

		// Handle downloads update
		let finalDownloads = currentChapter.downloads || [];

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

		// Update chapter, instructor relationships, and markers
		await prisma.chapter.update({
			where: { id },
			data: {
				...updateData,
				videoDuration: videoDuration,
				videoUrl: finalVideoUrl,
				hlsUrl: finalHlsUrl,
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
				markers: {
					// Delete existing markers
					deleteMany: {},
					// Create new markers only if there will be a video
					create:
						(finalVideoUrl || finalHlsUrl) && validatedMarkers
							? validatedMarkers.map((marker) => ({
									timestamp: marker.timestamp,
									title: marker.title,
									description: marker.description,
									position: marker.position,
							  }))
							: [],
				},
			},
		});

		// Check if course should be unpublished
		if (currentChapter.courseId) {
			await updateCoursePublishStatus(
				currentChapter.courseId,
				isBeingUnpublished
			);
		}

		revalidatePath('/user/lms', 'layout');
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
				hlsUrl: true,
			},
		});

		if (!chapter) {
			return { success: false, message: 'Chapter not found' };
		}

		const wasPublished = chapter.published;

		// Delete chapter (this will cascade delete markers due to Prisma schema)
		await prisma.chapter.delete({ where: { id } });

		// Delete associated files
		if (chapter?.videoUrl) {
			await deleteFile(chapter.videoUrl);
		}
		if (chapter?.hlsUrl) {
			try {
				await deleteHLSFolder(chapter.hlsUrl);
				console.info('✅ HLS folder deleted for chapter');
			} catch (error) {
				console.warn('⚠️ Failed to delete HLS folder:', error);
				// Continue with chapter deletion anyway
			}
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

		revalidatePath('/user/lms', 'layout');
		return { success: true, message: 'Chapter deleted successfully' };
	} catch (error) {
		console.error('Delete chapter error:', error);
		return { success: false, message: 'Failed to delete chapter' };
	}
}

// Helper function to validate markers against video duration
function validateMarkersAgainstDuration(
	markers: Array<{
		id: string;
		timestamp: number;
		title: string;
		description?: string;
		position: number;
	}>,
	videoDuration: number | undefined,
	hasVideo: boolean
): { isValid: boolean; errors?: string[] } {
	const errors: string[] = [];

	// If there are markers but no video, return error
	if (markers.length > 0 && !hasVideo) {
		errors.push(
			'Cannot add markers without a video. Please upload a video first.'
		);
		return { isValid: false, errors };
	}

	// If there's no video duration, we can't validate timestamps
	if (!videoDuration || videoDuration <= 0) {
		return { isValid: true };
	}

	// Check if any markers exceed video duration
	const invalidMarkers = markers.filter(
		(marker) => marker.timestamp > videoDuration
	);

	if (invalidMarkers.length > 0) {
		const formatTime = (seconds: number): string => {
			const mins = Math.floor(seconds / 60);
			const secs = Math.floor(seconds % 60);
			return `${mins}:${String(secs).padStart(2, '0')}`;
		};

		const videoDurationFormatted = formatTime(videoDuration);

		invalidMarkers.forEach((marker) => {
			const markerTimeFormatted = formatTime(marker.timestamp);
			errors.push(
				`Marker "${marker.title}" timestamp (${markerTimeFormatted}) exceeds video duration (${videoDurationFormatted})`
			);
		});

		return { isValid: false, errors };
	}

	return { isValid: true };
}
