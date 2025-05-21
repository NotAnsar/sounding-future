import { prisma } from '@/lib/prisma';
import { Prisma, type CourseTopic } from '@prisma/client';

type CourseTopicRes = {
	data: CourseTopic[];
	error?: boolean;
	message?: string;
};

export async function getTopics(): Promise<CourseTopicRes> {
	try {
		const topics = await prisma.courseTopic.findMany({
			orderBy: { createdAt: 'desc' },
		});

		return { data: topics, error: false };
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			console.error(`Database error: ${error.code}`, error);
			return {
				data: [],
				error: true,
				message: `Database error`,
			};
		}

		if (error instanceof Prisma.PrismaClientValidationError) {
			console.error('Validation error:', error);
			return { data: [], error: true, message: 'Invalid data provided' };
		}

		console.error('Error fetching course topics:', error);
		return {
			data: [],
			error: true,
			message: 'Unable to retrieve course topics. Please try again later.',
		};
	}
}

export type TopicDetails = CourseTopic;

type TopicDetailsRes = {
	error?: boolean;
	message?: string;
	data: TopicDetails | null;
};

export async function getTopicById(id: string): Promise<TopicDetailsRes> {
	try {
		const topic = await prisma.courseTopic.findUnique({
			where: { id },
		});

		if (!topic) {
			return { data: null, error: true, message: 'Course topic not found' };
		}

		return { data: topic, error: false };
	} catch (error) {
		console.error('Error fetching course topic:', error);
		return {
			data: null,
			error: true,
			message: 'Unable to retrieve course topic. Please try again later.',
		};
	}
}
