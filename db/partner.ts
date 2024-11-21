import { prisma } from '@/lib/prisma';
import { Partner, Prisma, SocialLinks } from '@prisma/client';

class PartnerError extends Error {
	constructor(message: string, public readonly cause?: unknown) {
		super(message);
		this.name = 'PartnerError';
	}
}

export async function getPartnersStats(): Promise<PartnerStats[]> {
	try {
		const data = await prisma.partner.findMany({
			include: {
				tracks: {
					include: {
						likes: true,
						listeners: true,
					},
				},
			},
			orderBy: { createdAt: 'desc' },
		});

		// Compute statistics
		const partnersWithStats: PartnerStats[] = data.map((partner) => {
			const totalTracks = partner.tracks.length;
			const totalLikes = partner.tracks.reduce(
				(sum, track) => sum + track.likes.length,
				0
			);
			const totalPlays = partner.tracks.reduce(
				(sum, track) => sum + track.listeners.length,
				0
			);

			return {
				id: partner.id,
				name: partner.name,
				picture: partner.picture,
				country: partner.country,
				studioPic: partner.studioPic,
				bio: partner.bio,
				socialId: partner.socialId,
				createdAt: partner.createdAt,
				tracks: totalTracks,
				liked: totalLikes,
				played: totalPlays,
			};
		});

		return partnersWithStats;
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			console.error(`Database error: ${error.code}`, error);
			throw new PartnerError(`Database error: ${error.message}`);
		}

		if (error instanceof Prisma.PrismaClientValidationError) {
			console.error('Validation error:', error);
			throw new PartnerError('Invalid data provided');
		}

		console.error('Error fetching partners data:', error);
		throw new PartnerError(
			'Unable to retrieve partners data. Please try again later.',
			error
		);
	}
}

export async function getPartners(): Promise<Partner[]> {
	try {
		const partners = await prisma.partner.findMany({
			orderBy: { createdAt: 'desc' },
		});

		return partners;
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			console.error(`Database error: ${error.code}`, error);
			throw new PartnerError(`Database error: ${error.message}`);
		}

		if (error instanceof Prisma.PrismaClientValidationError) {
			console.error('Validation error:', error);
			throw new PartnerError('Invalid data provided');
		}

		console.error('Error fetching partners:', error);
		throw new PartnerError(
			'Unable to retrieve partner data. Please try again later.',
			error
		);
	}
}

export async function getPartnerById(partnerId: string): Promise<PartnerLinks> {
	try {
		// Fetch partner data by ID
		const partner = await prisma.partner.findUnique({
			where: { id: partnerId },
			include: { socialLinks: true },
		});

		if (!partner) {
			throw new PartnerError(`Partner with ID ${partnerId} not found.`);
		}

		return partner;
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			console.error(`Database error: ${error.code}`, error);
			throw new PartnerError(`Database error: ${error.message}`);
		}

		if (error instanceof Prisma.PrismaClientValidationError) {
			console.error('Validation error:', error);
			throw new PartnerError('Invalid data provided');
		}

		console.error(`Error fetching partner with ID ${partnerId}:`, error);
		throw new PartnerError(
			`Unable to retrieve partner data for ID ${partnerId}. Please try again later.`,
			error
		);
	}
}

export type PartnerLinks = Partner & { socialLinks: SocialLinks | null };

export type PartnerStats = Partner & {
	tracks: number;
	liked: number;
	played: number;
};
