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

export async function getSupportUsSubscriptions(
	published?: boolean
): Promise<PricingPlanRes> {
	try {
		const where = published !== undefined ? { published } : {};

		const data = await prisma.pricingPlan.findMany({
			where,
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

export async function getProSubscription(): Promise<{
	data: string | null;
	error?: boolean;
	message?: string;
}> {
	try {
		const data = await prisma.pricingPlan.findFirst({
			where: { name: { equals: 'pro', mode: 'insensitive' } },
			select: { buttonLink: true },
		});

		if (!data?.buttonLink) {
			return {
				data: null,
				error: true,
				message: 'Subscription url not found',
			};
		}

		return { data: data.buttonLink, error: false };
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
