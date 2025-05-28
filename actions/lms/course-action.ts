'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import {
	checkFile,
	uploadFile,
	updateFile,
	deleteFile,
} from '@/actions/utils/s3-image';
import { generateSlug, imageSchema } from '../utils/utils';

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
	instructorIds: z.array(z.string()).optional(),
	seriesId: z.string().optional(),
});

type CourseData = z.infer<typeof CourseSchema>;

export type CourseFormState = {
	message?: string | null;
	errors?: {
		[K in keyof CourseData]?: string[];
	} & {
		[key: string]: string[];
	};
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
		return { canPublish: false, reason: 'Course ID is required' };
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
			reason: 'Course must have at least one chapter to be published',
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
			reason: 'Course must have at least one published chapter to be published',
		};
	}

	return { canPublish: true };
}

// Helper function to extract and process form data
function extractFormData(formData: FormData) {
	// Extract topics as array
	const topicIds = formData.getAll('topicIds').map((value) => value.toString());

	// Extract instructor IDs as array
	const instructorIds = formData
		.getAll('instructorIds')
		.map((value) => value.toString());

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
		const learningsText = formData.get('learnings')?.toString();
		if (learningsText) {
			const splitLearnings = learningsText
				.split('\n')
				.map((line) => line.trim())
				.filter(Boolean);
			learningsEntries.push(...splitLearnings);
		}
	}

	// Extract chapters as array with all necessary fields
	const chapters = [];
	let chapterIndex = 0;
	while (formData.has(`chapters[${chapterIndex}][id]`)) {
		const id = formData.get(`chapters[${chapterIndex}][id]`)?.toString();
		const title = formData.get(`chapters[${chapterIndex}][title]`)?.toString();
		const position = parseInt(
			formData.get(`chapters[${chapterIndex}][position]`)?.toString() || '0'
		);
		const isNew =
			formData.get(`chapters[${chapterIndex}][isNew]`)?.toString() === 'true';

		if (id && position > 0) {
			chapters.push({
				id,
				title: title || undefined,
				position,
				isNew,
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
		instructorIds: instructorIds.length > 0 ? instructorIds : undefined,
		learnings: learningsEntries,
		chapters,
		deletedChapters,
	};
}

export async function addCourse(
	prevState: CourseFormState,
	formData: FormData
): Promise<CourseFormState> {
	const { topicIds, instructorIds, learnings, chapters } =
		extractFormData(formData);

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
		instructorIds: instructorIds,
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
		instructorIds: validatedInstructorIds,
		chapters: validatedChapters,
		published,
		...otherData
	} = validatedFields.data;

	// Validate that we're not trying to publish a course without chapters
	if (published && (!validatedChapters || validatedChapters.length === 0)) {
		return {
			errors: {
				published: [
					'Cannot publish course without chapters. Please add chapters first.',
				],
			},
			message: 'Cannot publish course without chapters.',
		};
	}

	try {
		if (!thumbnail) {
			return {
				errors: { thumbnail: ['Thumbnail is required'] },
				message: 'Thumbnail is required',
			};
		}

		const thumbnailUrl = await uploadFile(thumbnail);
		const { title } = otherData;
		const slug = generateSlug(title);

		const course = await prisma.course.create({
			data: {
				...otherData,
				published: false, // Always create as draft first
				thumbnail: thumbnailUrl,
				slug,
				// Create connections to topics
				topics: {
					create:
						validatedTopicIds?.map((topicId) => ({
							topic: { connect: { id: topicId } },
						})) || [],
				},
				// Create connections to instructors
				instructors: {
					create:
						validatedInstructorIds?.map((instructorId, index) => ({
							instructor: { connect: { id: instructorId } },
							isPrimary: index === 0, // First instructor is primary
						})) || [],
				},
			},
		});

		// Create chapters if provided
		if (validatedChapters && validatedChapters.length > 0) {
			await Promise.all(
				validatedChapters.map((chapter) =>
					prisma.chapter.create({
						data: {
							id: chapter.id,
							title: chapter.title || 'Untitled Chapter',
							position: chapter.position,
							courseId: course.id,
							published: false,
						},
					})
				)
			);
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
	const { topicIds, instructorIds, learnings, chapters, deletedChapters } =
		extractFormData(formData);

	const validatedFields = CourseSchema.omit({ thumbnail: true }).safeParse({
		title: formData.get('title'),
		learnings: learnings,
		accessType: formData.get('accessType') || 'PRO',
		level: formData.get('level') || 'BEGINNER',
		published: formData.get('published') === 'true',
		topicIds: topicIds,
		instructorIds: instructorIds,
		chapters: chapters,
		deletedChapters: deletedChapters,
		description: formData.get('description') || undefined,
		skills: formData.get('skills') || undefined,
		credits: formData.get('credits') || undefined,
		seriesId: formData.get('seriesId') || undefined,
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Failed to update course. Please check the form for errors.',
		};
	}

	const {
		topicIds: validatedTopicIds,
		instructorIds: validatedInstructorIds,
		chapters: validatedChapters,
		deletedChapters: validatedDeletedChapters,
		description,
		skills,
		credits,
		seriesId,
		published,
		...otherData
	} = validatedFields.data;

	// If trying to publish, validate course requirements
	if (published) {
		const publishValidation = await canPublishCourse(id);
		if (!publishValidation.canPublish) {
			return {
				errors: {
					published: [publishValidation.reason || 'Cannot publish course'],
				},
				message: publishValidation.reason || 'Cannot publish course',
			};
		}
	}

	try {
		// Handle thumbnail update
		const thumbnailFile = formData.get('thumbnail');
		const thumbnailUrl = await updateFile(
			thumbnailFile,
			prevState?.prev?.thumbnail
		);

		const { title } = otherData;
		const slug = generateSlug(title);
		// Update course with chapters position reordering
		await prisma.$transaction(async (tx) => {
			// Delete chapters if any
			if (validatedDeletedChapters && validatedDeletedChapters.length > 0) {
				// Get chapters to delete with their media files
				const chaptersToDelete = await tx.chapter.findMany({
					where: {
						id: { in: validatedDeletedChapters },
						courseId: id,
					},
					select: {
						id: true,
						thumbnail: true,
						videoUrl: true,
					},
				});

				// Delete media files
				const deletePromises = [];
				for (const chapter of chaptersToDelete) {
					if (chapter.thumbnail) {
						deletePromises.push(deleteFile(chapter.thumbnail));
					}
					if (chapter.videoUrl) {
						deletePromises.push(deleteFile(chapter.videoUrl));
					}
				}

				if (deletePromises.length > 0) {
					await Promise.allSettled(deletePromises);
				}

				// Delete chapters from database
				await tx.chapter.deleteMany({
					where: {
						id: { in: validatedDeletedChapters },
						courseId: id,
					},
				});
			}

			// Delete all existing topic connections
			await tx.courseToTopic.deleteMany({
				where: { courseId: id },
			});

			// Delete all existing instructor connections
			await tx.courseToInstructor.deleteMany({
				where: { courseId: id },
			});

			// Handle chapters updates and creation
			if (validatedChapters && validatedChapters.length > 0) {
				for (const chapter of validatedChapters) {
					if (chapter.isNew) {
						// Create new chapter
						await tx.chapter.create({
							data: {
								id: chapter.id,
								title: chapter.title || 'Untitled Chapter',
								position: chapter.position,
								courseId: id,
								published: false,
							},
						});
					} else {
						// Update existing chapter position and title
						await tx.chapter.update({
							where: { id: chapter.id },
							data: {
								position: chapter.position,
								title: chapter.title || 'Untitled Chapter',
							},
						});
					}
				}
			}

			// Update course and create new topic and instructor connections
			await tx.course.update({
				where: { id },
				data: {
					...otherData,
					published,
					description: description ? description : null,
					skills: skills ? skills : null,
					credits: credits ? credits : null,
					seriesId: seriesId ? seriesId : null,
					thumbnail: thumbnailUrl,
					slug,
					topics: {
						create:
							validatedTopicIds?.map((topicId) => ({
								topic: { connect: { id: topicId } },
							})) || [],
					},
					instructors: {
						create:
							validatedInstructorIds?.map((instructorId, index) => ({
								instructor: { connect: { id: instructorId } },
								isPrimary: index === 0, // First instructor is primary
							})) || [],
					},
				},
			});
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
		// Get course details with all chapters and their media files
		const course = await prisma.course.findUnique({
			where: { id },
			select: {
				thumbnail: true,
				chapters: {
					select: {
						id: true,
						thumbnail: true,
						videoUrl: true,
					},
				},
			},
		});

		if (!course) {
			return { success: false, message: 'Course not found' };
		}

		// Delete the course (chapters will be cascade deleted due to foreign key)
		await prisma.course.delete({ where: { id } });

		// Delete all media files
		const deletePromises = [];

		// Delete course thumbnail
		if (course.thumbnail) {
			deletePromises.push(deleteFile(course.thumbnail));
		}

		// Delete all chapter media files
		for (const chapter of course.chapters) {
			if (chapter.thumbnail) {
				deletePromises.push(deleteFile(chapter.thumbnail));
			}
			if (chapter.videoUrl) {
				deletePromises.push(deleteFile(chapter.videoUrl));
			}
		}

		// Execute all deletions in parallel
		if (deletePromises.length > 0) {
			await Promise.allSettled(deletePromises);
		}

		revalidatePath('/user/lms');
		return { success: true, message: 'Course deleted successfully' };
	} catch (error) {
		console.error('Delete error:', error);
		return { success: false, message: 'Failed to delete course' };
	}
}
