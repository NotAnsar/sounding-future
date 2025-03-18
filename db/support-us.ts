import { prisma } from '@/lib/prisma';
import { PricingPage, Prisma } from '@prisma/client';

type PricingPageRes = {
	data: PricingPage | null;
	error?: boolean;
	message?: string;
};

export async function getSupportUsPageData(): Promise<PricingPageRes> {
	try {
		const data = await prisma.pricingPage.findFirst({
			where: { id: '1' },
		});

		if (!data) {
			return {
				data: null,
				error: true,
				message: 'Support Us Page Data Not Found',
			};
		}

		return { data, error: false };
	} catch (error) {
		console.error('Error fetching Support Us Page Data:', error);

		return {
			data: null,
			error: true,
			message:
				'Unable to retrieve Support Us Page Data. Please try again later.',
		};
	}
}

type PricingPlanRes = {
	data: Prisma.PricingPlanGetPayload<{ include: { sections: true } }>[];
	error?: boolean;
	message?: string;
};

export async function getSupportUsSubscriptions(): Promise<PricingPlanRes> {
	try {
		const data = await prisma.pricingPlan.findMany({
			include: { sections: true },
			orderBy: { displayOrder: 'asc' },
		});

		if (!data) {
			return {
				data: [],
				error: true,
				message: 'Support Us Subscriptions Not Found',
			};
		}

		return { data, error: false };
	} catch (error) {
		console.error('Error fetching Support Us Subscriptions:', error);

		return {
			data: [],
			error: true,
			message:
				'Unable to retrieve Support Us Subscriptions. Please try again later.',
		};
	}
}
