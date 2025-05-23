'use server';

import { z } from 'zod';
import { imageSchema, State } from '@/actions/utils/utils';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {
	checkFile,
	deleteFile,
	updateFile,
	uploadFile,
} from '@/actions/utils/s3-image';

// Define Chapter schema for validation - title is optional
const ChapterSchema = z.object({
	id: z.string(),
	title: z.string().optional(),
	position: z.number().min(1),
	isNew: z.boolean().optional(),
});

// Define Course schema for validation
const CourseSchema = z.object({
	title: z
		.string()
		.min(1, 'Course title is required')
		.max(100, 'Course title must be 100 characters or less'),
	thumbnail: imageSchema.shape.file,
	description: z.string().optional(),
	learnings: z
		.array(z.string())
		.min(1, 'At least one learning outcome is required'),
	topicIds: z.array(z.string()).optional(),
	accessType: z.string().default('PRO'),
	level: z.string().default('BEGINNER'),
	published: z.boolean().default(false),
	chapters: z.array(ChapterSchema).optional(),
	deletedChapters: z.array(z.string()).optional(),
	skills: z.string().optional(),
	credits: z.string().optional(),
	instructorId: z.string().optional(),
	seriesId: z.string().optional(),
});

type CourseData = z.infer<typeof CourseSchema>;

export type CourseFormState = State<CourseData> & {
	prev?: { thumbnail?: string | undefined };
};

export type DeleteCourseState = {
	message?: string | null;
	success?: boolean;
};

// Helper function to check if course can be published
async function canPublishCourse(
	courseId?: string
): Promise<{ canPublish: boolean; reason?: string }> {
	if (!courseId) {
		return { canPublish: false, reason: 'Course must be created first' };
	}

	// Check if course has any chapters
	const totalChaptersCount = await prisma.chapter.count({
		where: {
			courseId: courseId,
		},
	});

	if (totalChaptersCount === 0) {
		return {
			canPublish: false,
			reason: 'Course must have at least one chapter',
		};
	}

	// Check if course has published chapters
	const publishedChaptersCount = await prisma.chapter.count({
		where: {
			courseId: courseId,
			published: true,
		},
	});

	if (publishedChaptersCount === 0) {
		return {
			canPublish: false,
			reason: 'Course must have at least one published chapter',
		};
	}

	return { canPublish: true };
}

// Helper function to extract and process form data
function extractFormData(formData: FormData) {
	// Extract topics as array
	const topicIds = formData.getAll('topicIds').map((value) => value.toString());

	// Extract learnings as array - handle both old textarea format and new array format
	const learningsEntries = [];
	let index = 0;
	while (formData.has(`learnings[${index}]`)) {
		const learning = formData.get(`learnings[${index}]`)?.toString().trim();
		if (learning) {
			learningsEntries.push(learning);
		}
		index++;
	}

	// Fallback to old textarea format if no array format found
	if (learningsEntries.length === 0) {
		const learningsText = formData.get('learnings')?.toString() || '';
		learningsEntries.push(
			...learningsText.split('\n').filter((line) => line.trim() !== '')
		);
	}

	// Extract chapters as array with all necessary fields
	const chapters = [];
	let chapterIndex = 0;
	while (formData.has(`chapters[${chapterIndex}][id]`)) {
		const chapterId = formData.get(`chapters[${chapterIndex}][id]`)?.toString();
		const chapterTitle =
			formData.get(`chapters[${chapterIndex}][title]`)?.toString() || '';
		const chapterPosition = parseInt(
			formData.get(`chapters[${chapterIndex}][position]`)?.toString() || '0'
		);
		const isNew =
			formData.get(`chapters[${chapterIndex}][isNew]`)?.toString() === 'true';

		if (chapterId && chapterPosition) {
			chapters.push({
				id: chapterId,
				title: chapterTitle,
				position: chapterPosition,
				isNew: isNew,
			});
		}
		chapterIndex++;
	}

	// Extract deleted chapters
	const deletedChapters = [];
	let deletedIndex = 0;
	while (formData.has(`deletedChapters[${deletedIndex}]`)) {
		const deletedId = formData
			.get(`deletedChapters[${deletedIndex}]`)
			?.toString();
		if (deletedId) {
			deletedChapters.push(deletedId);
		}
		deletedIndex++;
	}

	return {
		topicIds: topicIds.length > 0 ? topicIds : undefined,
		learnings: learningsEntries,
		chapters,
		deletedChapters,
	};
}

export async function addCourse(
	prevState: CourseFormState,
	formData: FormData
): Promise<CourseFormState> {
	const { topicIds, learnings, chapters } = extractFormData(formData);

	const validatedFields = CourseSchema.safeParse({
		title: formData.get('title'),
		description: formData.get('description') || undefined,
		thumbnail: await checkFile(formData.get('thumbnail')),
		learnings: learnings,
		skills: formData.get('skills') || undefined,
		credits: formData.get('credits') || undefined,
		accessType: formData.get('accessType') || 'PRO',
		level: formData.get('level') || 'BEGINNER',
		published: formData.get('published') === 'true',
		instructorId: formData.get('instructorId') || undefined,
		seriesId: formData.get('seriesId') || undefined,
		topicIds: topicIds,
		chapters: chapters,
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Failed to create course. Please check the form for errors.',
		};
	}

	const {
		thumbnail,
		topicIds: validatedTopicIds,
		chapters: validatedChapters,
		published,
		...otherData
	} = validatedFields.data;

	// Check if trying to publish without chapters
	if (published) {
		if (!validatedChapters || validatedChapters.length === 0) {
			return {
				errors: {
					published: ['Cannot publish course without chapters'],
				},
				message: 'Cannot publish course without chapters.',
			};
		}

		// New courses with chapters can't be published immediately since chapters will be created as unpublished
		return {
			errors: {
				published: [
					'Cannot publish course without at least one published chapter',
				],
			},
			message: 'Cannot publish course without published chapters.',
		};
	}

	try {
		const thumbnailUrl = thumbnail ? await uploadFile(thumbnail) : undefined;

		const course = await prisma.course.create({
			data: {
				...otherData,
				published: false, // Always create course as unpublished initially
				thumbnail: thumbnailUrl,
				// Create connections to topics
				topics: {
					create:
						validatedTopicIds?.map((topicId) => ({
							topic: { connect: { id: topicId } },
						})) || [],
				},
			},
		});

		// Create chapters - titles can be empty
		if (validatedChapters && validatedChapters.length > 0) {
			const chaptersToCreate = validatedChapters
				.filter((chapter) => chapter.isNew) // Only create new chapters
				.map((chapter) => ({
					title: chapter.title || 'Untitled Chapter', // Default title if empty
					position: chapter.position,
					accessType: 'PRO',
					published: false, // Always create chapters as unpublished
					courseId: course.id,
				}));

			if (chaptersToCreate.length > 0) {
				await prisma.chapter.createMany({
					data: chaptersToCreate,
				});
			}
		}

		revalidatePath('/user/lms');
	} catch (error) {
		console.error(error);
		return { message: 'Failed to create course' };
	}
	redirect('/user/lms');
}

export async function updateCourse(
	id: string,
	prevState: CourseFormState,
	formData: FormData
): Promise<CourseFormState> {
	const { topicIds, learnings, chapters, deletedChapters } =
		extractFormData(formData);

	const validatedFields = CourseSchema.omit({ thumbnail: true }).safeParse({
		title: formData.get('title'),
		learnings: learnings,
		accessType: formData.get('accessType') || 'PRO',
		level: formData.get('level') || 'BEGINNER',
		published: formData.get('published') === 'true',
		topicIds: topicIds,
		chapters: chapters,
		deletedChapters: deletedChapters,
		description: formData.get('description') || undefined,
		skills: formData.get('skills') || undefined,
		credits: formData.get('credits') || undefined,
		instructorId: formData.get('instructorId') || undefined,
		seriesId: formData.get('seriesId') || undefined,
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Failed to update course. Please check the form for errors.',
		};
	}

	const { published } = validatedFields.data;

	// Check if trying to publish course without chapters or published chapters
	if (published) {
		// First check: Will the course have chapters after all operations?
		const currentChapterCount = await prisma.chapter.count({
			where: { courseId: id },
		});

		const newChaptersCount = chapters?.filter((ch) => ch.isNew)?.length || 0;
		const deletedChaptersCount = deletedChapters?.length || 0;
		const finalChapterCount =
			currentChapterCount + newChaptersCount - deletedChaptersCount;

		if (finalChapterCount === 0) {
			return {
				errors: {
					published: ['Cannot publish course without chapters'],
				},
				message: 'Course cannot be published without chapters.',
			};
		}

		// Second check: Does the course have published chapters?
		const publishCheck = await canPublishCourse(id);
		if (!publishCheck.canPublish) {
			return {
				errors: {
					published: [`Cannot publish course: ${publishCheck.reason}`],
				},
				message: `Course cannot be published: ${publishCheck.reason}`,
			};
		}
	}

	const thumbnail = formData.get('thumbnail');
	if (thumbnail instanceof File && thumbnail.size > 2 * 1024 * 1024) {
		return {
			message: 'Thumbnail must be less than 2MB',
			errors: { thumbnail: ['Thumbnail must be less than 2MB'] },
		};
	}

	const {
		topicIds: validatedTopicIds,
		chapters: validatedChapters,
		deletedChapters: validatedDeletedChapters,
		description,
		skills,
		credits,
		instructorId,
		seriesId,
		...otherData
	} = validatedFields.data;

	try {
		// Get the current course to check if we need to update the image
		const currentCourse = await prisma.course.findUnique({
			where: { id },
			select: { thumbnail: true },
		});

		let thumbnailUrl = currentCourse?.thumbnail;

		// Handle thumbnail update if provided
		if (thumbnail instanceof File && thumbnail.size > 0) {
			if (thumbnailUrl) {
				// Update existing image
				thumbnailUrl = await updateFile(thumbnail, thumbnailUrl);
			} else {
				// Upload new image
				thumbnailUrl = await uploadFile(thumbnail);
			}
		}

		// Update course with chapters position reordering
		await prisma.$transaction(async (tx) => {
			// First, delete chapters that were marked for deletion
			if (validatedDeletedChapters && validatedDeletedChapters.length > 0) {
				await tx.chapter.deleteMany({
					where: {
						id: { in: validatedDeletedChapters },
						courseId: id, // Ensure we only delete chapters from this course
					},
				});
			}

			// Delete all existing topic connections
			await tx.courseToTopic.deleteMany({
				where: { courseId: id },
			});

			// Handle chapters - both new and existing
			if (validatedChapters && validatedChapters.length > 0) {
				// Separate new chapters from existing ones
				const newChapters = validatedChapters.filter(
					(chapter) => chapter.isNew
				);
				const existingChapters = validatedChapters.filter(
					(chapter) => !chapter.isNew
				);

				// Create new chapters with course ID
				if (newChapters.length > 0) {
					const chaptersToCreate = newChapters.map((chapter) => ({
						title: chapter.title || 'Untitled Chapter',
						position: chapter.position,
						accessType: 'PRO',
						published: false, // Always create new chapters as unpublished
						courseId: id,
					}));

					await tx.chapter.createMany({
						data: chaptersToCreate,
					});
				}

				// Update existing chapters (position and title)
				for (const chapter of existingChapters) {
					// Check if chapter exists and belongs to this course
					const existingChapter = await tx.chapter.findFirst({
						where: {
							id: chapter.id,
							courseId: id,
						},
					});

					if (existingChapter) {
						// Update existing chapter position and title
						await tx.chapter.update({
							where: { id: chapter.id },
							data: {
								position: chapter.position,
								title: chapter.title || existingChapter.title, // Keep existing title if new one is empty
							},
						});
					}
				}
			}

			// After all operations, verify course can be published
			if (published) {
				const finalPublishCheck = await canPublishCourse(id);
				if (!finalPublishCheck.canPublish) {
					// If conditions not met, keep course unpublished
					await tx.course.update({
						where: { id },
						data: {
							...otherData,
							description: description ? description : null,
							skills: skills ? skills : null,
							credits: credits ? credits : null,
							instructorId: instructorId ? instructorId : null,
							seriesId: seriesId ? seriesId : null,
							thumbnail: thumbnailUrl,
							published: false, // Force unpublished
							topics: {
								create:
									validatedTopicIds?.map((topicId) => ({
										topic: { connect: { id: topicId } },
									})) || [],
							},
						},
					});
				} else {
					// Course can be published
					await tx.course.update({
						where: { id },
						data: {
							...otherData,
							description: description ? description : null,
							skills: skills ? skills : null,
							credits: credits ? credits : null,
							instructorId: instructorId ? instructorId : null,
							seriesId: seriesId ? seriesId : null,
							thumbnail: thumbnailUrl,
							topics: {
								create:
									validatedTopicIds?.map((topicId) => ({
										topic: { connect: { id: topicId } },
									})) || [],
							},
						},
					});
				}
			} else {
				// Not trying to publish, update normally
				await tx.course.update({
					where: { id },
					data: {
						...otherData,
						description: description ? description : null,
						skills: skills ? skills : null,
						credits: credits ? credits : null,
						instructorId: instructorId ? instructorId : null,
						seriesId: seriesId ? seriesId : null,
						thumbnail: thumbnailUrl,
						topics: {
							create:
								validatedTopicIds?.map((topicId) => ({
									topic: { connect: { id: topicId } },
								})) || [],
						},
					},
				});
			}
		});

		revalidatePath('/user/lms');
	} catch (error) {
		console.error('Update error:', error);
		return { message: 'Failed to update course' };
	}

	redirect('/user/lms');
}

export async function deleteCourse(id: string): Promise<DeleteCourseState> {
	try {
		// Get course details to get the thumbnail URL
		const course = await prisma.course.findUnique({
			where: { id },
			select: { thumbnail: true },
		});

		// Delete the course (chapters will be cascade deleted due to foreign key)
		await prisma.course.delete({ where: { id } });

		// Delete the thumbnail if it exists
		if (course?.thumbnail) {
			await deleteFile(course.thumbnail);
		}

		revalidatePath('/user/lms');
		return { success: true, message: 'Course deleted successfully' };
	} catch (error) {
		console.error('Delete error:', error);
		return { success: false, message: 'Failed to delete course' };
	}
}
