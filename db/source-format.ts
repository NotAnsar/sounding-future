import { prisma } from '@/lib/prisma';
import { Prisma, type SourceFormat } from '@prisma/client';

export async function getSourceFormats(): Promise<{
	data: SourceFormat[];
	message?: string;
	error?: boolean;
}> {
	try {
		const sourceFormats = await prisma.sourceFormat.findMany({
			orderBy: { displayOrder: 'asc' },
		});

		return { data: sourceFormats, error: false };
	} catch (error) {
		let message =
			'Unable to retrieve source formats data. Please try again later.';
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			// Handle specific Prisma errors
			console.error(`Database error: ${error.code}`, error);
			message = `Database error: ${error.code}`;
		}

		if (error instanceof Prisma.PrismaClientValidationError) {
			console.error('Validation error:', error);
			message = 'Invalid data provided';
		}

		// Generic error handling
		console.error('Error fetching source formats data:', error);
		return { data: [], message, error: true };
	}
}
