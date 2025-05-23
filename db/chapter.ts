import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export type ChapterWithRelations = Prisma.ChapterGetPayload<{
	include: { course: { select: { id: true; title: true } } };
}>;

export async function getChapters() {
	try {
		const chapters = await prisma.chapter.findMany({
			include: {
				course: {
					select: {
						id: true,
						title: true,
					},
				},
			},
			orderBy: [{ course: { title: 'asc' } }, { position: 'asc' }],
		});

		return { data: chapters, error: false };
	} catch (error) {
		console.error('Error fetching chapters:', error);
		return {
			data: null,
			error: true,
			message: 'Failed to fetch chapters',
		};
	}
}

export async function getChapterById(id: string) {
	try {
		const chapter = await prisma.chapter.findUnique({
			where: { id },
			include: {
				course: {
					select: {
						id: true,
						title: true,
					},
				},
			},
		});

		if (!chapter) {
			return {
				data: null,
				error: true,
				message: 'Chapter not found',
			};
		}

		return { data: chapter, error: false };
	} catch (error) {
		console.error('Error fetching chapter:', error);
		return {
			data: null,
			error: true,
			message: 'Failed to fetch chapter',
		};
	}
}

export async function getChaptersByCourse(courseId: string) {
	try {
		const chapters = await prisma.chapter.findMany({
			where: { courseId },
			orderBy: { position: 'asc' },
			include: {
				course: {
					select: {
						id: true,
						title: true,
					},
				},
			},
		});

		return { data: chapters, error: false };
	} catch (error) {
		console.error('Error fetching chapters by course:', error);
		return {
			data: null,
			error: true,
			message: 'Failed to fetch chapters',
		};
	}
}
