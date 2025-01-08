import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

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
