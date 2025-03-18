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

export type SubscriptionCardData = Prisma.PricingPlanGetPayload<{
	include: { sections: true };
}>;

type PricingPlanRes = {
	data: SubscriptionCardData[];
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

export async function getSubscriptionById(id?: string): Promise<{
	data: SubscriptionCardData | null;
	error?: boolean;
	message?: string;
}> {
	try {
		const data = await prisma.pricingPlan.findFirst({
			where: { id },
			include: { sections: true },
		});

		if (!data) {
			return {
				data: null,
				error: true,
				message: 'Subscription card data Not Found',
			};
		}

		return { data, error: false };
	} catch (error) {
		console.error('Error fetching Subscription card data:', error);

		return {
			data: null,
			error: true,
			message:
				'Unable to retrieve Subscription card data. Please try again later.',
		};
	}
}
