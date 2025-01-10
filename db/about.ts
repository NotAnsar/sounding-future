import { prisma } from '@/lib/prisma';
import { AboutCards, AboutHeader } from '@prisma/client';

type AboutHeaderRes = {
	data: AboutHeader | null;
	error?: boolean;
	message?: string;
};

export async function getAboutHeader(): Promise<AboutHeaderRes> {
	try {
		const aboutHeader = await prisma.aboutHeader.findUnique({
			where: { id: '1' },
		});

		if (!aboutHeader) {
			return { data: null, error: true, message: 'About Header Not Found' };
		}

		return { data: aboutHeader, error: false };
	} catch (error) {
		console.error('Error fetching about header:', error);

		return {
			data: null,
			error: true,
			message: 'Unable to retrieve about header. Please try again later.',
		};
	}
}

type AboutCardsRes = {
	data: AboutCards | null;
	error?: boolean;
	message?: string;
};

export async function getAboutCards(
	type: 'producers' | 'consumers' = 'producers'
): Promise<AboutCardsRes> {
	try {
		const data = await prisma.aboutCards.findUnique({
			where: { id: type === 'producers' ? '2' : '1' },
		});

		if (!data) {
			return { data: null, error: true, message: 'About Cards Not Found' };
		}

		return { data, error: false };
	} catch (error) {
		console.error('Error fetching about cards:', error);

		return {
			data: null,
			error: true,
			message: 'Unable to retrieve about cards. Please try again later.',
		};
	}
}
