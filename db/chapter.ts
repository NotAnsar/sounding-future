import { prisma } from '@/lib/prisma';
import { Chapter } from '@prisma/client';

export type ChapterWithRelations = Chapter & {
	course: {
		id: string;
		title: string;
	};
	instructors: {
		instructorId: string;
		instructor: {
			id: string;
			name: string;
		};
	}[];
};

export async function getChapters(courseId?: string) {
	try {
		const chapters = await prisma.chapter.findMany({
			where: courseId ? { courseId } : undefined,
			include: {
				course: {
					select: {
						id: true,
						title: true,
					},
				},
				instructors: {
					include: {
						instructor: {
							select: {
								id: true,
								name: true,
							},
						},
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
				instructors: {
					include: {
						instructor: {
							select: {
								id: true,
								name: true,
							},
						},
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
