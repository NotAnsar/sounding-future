import { prisma } from '@/lib/prisma';
import { SocialLinks } from '@prisma/client';

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
