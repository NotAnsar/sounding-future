import { prisma } from '@/lib/prisma';
import { Partner, Prisma, SocialLinks } from '@prisma/client';

export async function getPartnersStats(): Promise<{
	data: PartnerStats[];
	message?: string;
	error?: boolean;
}> {
	try {
		const data = await prisma.partner.findMany({
			include: {
				_count: { select: { tracks: true } },
				tracks: {
					select: { _count: { select: { likes: true, listeners: true } } },
				},
			},
			orderBy: { displayOrder: 'asc' },
		});

		return {
			data: data.map((partner) => ({
				...partner,
				tracks: partner._count.tracks,
				liked: partner.tracks.reduce(
					(sum, track) => sum + track._count.likes,
					0
				),
				played: partner.tracks.reduce(
					(sum, track) => sum + track._count.listeners,
					0
				),
			})),
			error: false,
		};
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			console.error(`Database error: ${error.code}`, error);
			// throw new PartnerError(`Database error: ${error.message}`);
			return { data: [], message: error.message, error: true };
		}

		if (error instanceof Prisma.PrismaClientValidationError) {
			console.error('Validation error:', error);
			return { data: [], message: 'Invalid data provided', error: true };
		}

		console.error('Error fetching partners data:', error);

		return {
			data: [],
			message: 'Unable to retrieve partners data. Please try again later.',
			error: true,
		};
	}
}

export async function getPartners(): Promise<{
	data: Partner[];
	message?: string;
	error?: boolean;
}> {
	try {
		const partners = await prisma.partner.findMany({
			orderBy: { displayOrder: 'asc' },
		});

		return { data: partners, error: false };
	} catch (error) {
		let message = 'Unable to retrieve partner data. Please try again later.';
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			console.error(`Database error: ${error.code}`, error);
			message = `Database error: ${error.code}`;
		}

		if (error instanceof Prisma.PrismaClientValidationError) {
			console.error('Validation error:', error);
			message = 'Invalid data provided';
		}

		console.error('Error fetching partners:', error);
		return { data: [], message, error: true };
	}
}

export async function getPartnerById(
	partnerId: string
): Promise<{ data: PartnerLinks | null; error?: boolean; message?: string }> {
	try {
		// Fetch partner data by ID
		const partner = await prisma.partner.findUnique({
			where: { id: partnerId },
			include: { socialLinks: true },
		});

		if (!partner) {
			return {
				data: null,
				error: true,
				message: `Partner with ID ${partnerId} not found.`,
			};
		}

		return { data: partner, error: false };
	} catch (error) {
		let message = `Unable to retrieve partner data for ID ${partnerId}. Please try again later.`;
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			console.error(`Database error: ${error.code}`, error);
			message = `Database error: ${error.message}`;
		}

		if (error instanceof Prisma.PrismaClientValidationError) {
			console.error('Validation error:', error);
			message = 'Invalid data provided';
		}

		console.error(`Error fetching partner with ID ${partnerId}:`, error);
		return { data: null, error: true, message };
	}
}

export type PartnerDetails = Prisma.PartnerGetPayload<{
	include: { socialLinks: true };
}>;

export async function getPartnerDetailsById(
	partnerId: string
): Promise<{ data: PartnerDetails | null; error?: boolean; message?: string }> {
	try {
		// Fetch partner data by ID
		const partner = await prisma.partner.findUnique({
			where: { id: partnerId },
			include: { socialLinks: true },
		});

		if (!partner) {
			return {
				data: null,
				error: true,
				message: `Partner with ID ${partnerId} not found.`,
			};
		}

		return { data: partner, error: false };
	} catch (error) {
		let message = `Unable to retrieve partner data for ID ${partnerId}. Please try again later.`;
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			console.error(`Database error: ${error.code}`, error);
			message = `Database error: ${error.message}`;
		}

		if (error instanceof Prisma.PrismaClientValidationError) {
			console.error('Validation error:', error);
			message = 'Invalid data provided';
		}

		console.error(`Error fetching partner with ID ${partnerId}:`, error);
		return { data: null, error: true, message };
	}
}

export type PartnerLinks = Partner & { socialLinks: SocialLinks | null };

export type PartnerStats = Partner & {
	tracks: number;
	liked: number;
	played: number;
};
