import { prisma } from '@/lib/prisma';
import { HelpCenterVideo } from '@prisma/client';

type HelpCenterRes = {
	data: HelpCenterVideo[];
	error?: boolean;
	message?: string;
};

export async function getHelpCenter(
	published?: boolean
): Promise<HelpCenterRes> {
	try {
		const data = await prisma.helpCenterVideo.findMany({
			where: published !== undefined ? { published } : {},
			orderBy: { displayOrder: 'asc' },
		});

		return { data, error: false };
	} catch (error) {
		console.error('Error fetching help center videos:', error);

		return {
			data: [],
			error: true,
			message: 'Unable to retrieve help center videos. Please try again later.',
		};
	}
}

export async function getHelpCenterById(id: string): Promise<{
	data: HelpCenterVideo | null;
	error?: boolean;
	message?: string;
}> {
	try {
		const data = await prisma.helpCenterVideo.findUnique({
			where: { id },
		});

		if (!data) {
			return {
				data: null,
				error: true,
				message: 'Subscription Section Data Not Found',
			};
		}

		return { data, error: false };
	} catch (error) {
		console.error('Error fetching help center videos:', error);

		return {
			data: null,
			error: true,
			message: 'Unable to retrieve help center videos. Please try again later.',
		};
	}
}

export async function getStarterVideo(): Promise<{
	data: HelpCenterVideo | null;
	error?: boolean;
	message?: string;
}> {
	try {
		const data = await prisma.helpCenterVideo.findFirst({
			where: { published: true },
			orderBy: { displayOrder: 'asc' },
		});

		if (!data) {
			return {
				data: null,
				error: true,
				message: 'Subscription Section Data Not Found',
			};
		}

		return { data, error: false };
	} catch (error) {
		console.error('Error fetching help center videos:', error);

		return {
			data: null,
			error: true,
			message: 'Unable to retrieve help center videos. Please try again later.',
		};
	}
}
