import { prisma } from '@/lib/prisma';
import { FAQ, NewsLetter, Prisma, SocialLinks } from '@prisma/client';

type SocialRes = {
	data: SocialLinks | null;
	error?: boolean;
	message?: string;
};

export async function getSocialLinks(): Promise<SocialRes> {
	try {
		const socialLinks = await prisma.socialLinks.findUnique({
			where: { id: 'cm5jsbxc80000yteee6i2hr45' },
		});

		if (!socialLinks) {
			return { data: null, error: true, message: 'Social Links Not Found' };
		}

		return { data: socialLinks, error: false };
	} catch (error) {
		console.error('Error fetching social links:', error);

		return {
			data: null,
			error: true,
			message: 'Unable to retrieve social links. Please try again later.',
		};
	}
}

type FaqRes = {
	data: FAQ[];
	error?: boolean;
	message?: string;
};

export async function getFaqs(): Promise<FaqRes> {
	try {
		const faqs = await prisma.fAQ.findMany({
			orderBy: { displayOrder: 'asc' },
		});

		return { data: faqs, error: false };
	} catch (error) {
		console.error('Error fetching faqs:', error);

		return {
			data: [],
			error: true,
			message: 'Unable to retrieve faqs. Please try again later.',
		};
	}
}

type NewsLetterRes = {
	data: NewsLetter | null;
	error?: boolean;
	message?: string;
};

export async function getNewsLetter(): Promise<NewsLetterRes> {
	try {
		const newsLetter = await prisma.newsLetter.findFirst({
			where: { id: 'cm5mjsckm000013no8aqexof6' },
		});

		if (!newsLetter) {
			return { data: null, error: true, message: 'News letter Not Found' };
		}

		return { data: newsLetter, error: false };
	} catch (error) {
		console.error('Error fetching news letter:', error);

		return {
			data: null,
			error: true,
			message: 'Unable to retrieve news letter. Please try again later.',
		};
	}
}

type SubscriptionRes = {
	data: NewsLetter | null;
	error?: boolean;
	message?: string;
};

export async function getSubscription(): Promise<SubscriptionRes> {
	try {
		const newsLetter = await prisma.newsLetter.findFirst({
			where: { id: 'cm5mkvhvr0000w6jgtu3eow1l' },
		});

		if (!newsLetter) {
			return {
				data: null,
				error: true,
				message: 'Subscription Section Data Not Found',
			};
		}

		return { data: newsLetter, error: false };
	} catch (error) {
		console.error('Error fetching Subscription Section Data:', error);

		return {
			data: null,
			error: true,
			message:
				'Unable to retrieve Subscription Section Data. Please try again later.',
		};
	}
}

type TermsPageRes = {
	data: Prisma.TermsPageGetPayload<{ include: { sections: true } }> | null;
	error?: boolean;
	message?: string;
};

export async function getTermsData(
	type: 'terms' | 'privacy' = 'terms'
): Promise<TermsPageRes> {
	try {
		const termsPage = await prisma.termsPage.findFirst({
			where: {
				id:
					type === 'privacy'
						? 'cm5mz7rox00055l73fjehn81t'
						: 'cm5mygk0d00005l73t2exhowi',
			},
			include: {
				sections: {
					orderBy: { order: 'asc' },
				},
			},
		});

		if (!termsPage) {
			return {
				data: null,
				error: true,
				message: 'Terms Page Data Not Found',
			};
		}

		return { data: termsPage, error: false };
	} catch (error) {
		console.error('Error fetching Terms Page Data:', error);

		return {
			data: null,
			error: true,
			message: 'Unable to retrieve Terms Page Data. Please try again later.',
		};
	}
}
