import { prisma } from '@/lib/prisma';
import { Banner, Prisma } from '@prisma/client';

type BannersRes = { data: Banner[]; error?: boolean; message?: string };

export async function getBanners(publishedOnly = false): Promise<BannersRes> {
	try {
		const banners = await prisma.banner.findMany({
			where: publishedOnly ? { published: true } : undefined,
			orderBy: { createdAt: 'desc' },
		});

		return { data: banners, error: false };
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			console.error(`Database error: ${error.code}`, error);

			return {
				data: [],
				error: true,
				message: `Database error: ${error.message}`,
			};
		}

		if (error instanceof Prisma.PrismaClientValidationError) {
			console.error('Validation error:', error);

			return { data: [], error: true, message: 'Invalid data provided' };
		}

		console.error('Error fetching banners:', error);

		return {
			data: [],
			error: true,
			message: 'Unable to retrieve banners. Please try again later.',
		};
	}
}

type BannerDetailsRes = {
	error?: boolean;
	message?: string;
	data: Banner | null;
};

export async function getBannerByid(id: string): Promise<BannerDetailsRes> {
	try {
		const banner = await prisma.banner.findUnique({
			where: { id },
		});

		if (!banner) {
			return { data: null, error: true, message: 'Banner not found' };
		}

		return { data: banner, error: false };
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			console.error(`Database error: ${error.code}`, error);

			return {
				data: null,
				error: true,
				message: `Database error: ${error.message}`,
			};
		}

		if (error instanceof Prisma.PrismaClientValidationError) {
			console.error('Validation error:', error);

			return { data: null, error: true, message: 'Invalid data provided' };
		}

		console.error('Error fetching banner:', error);

		return {
			data: null,
			error: true,
			message: 'Unable to retrieve banner. Please try again later.',
		};
	}
}
