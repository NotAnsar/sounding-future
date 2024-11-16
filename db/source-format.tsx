import { prisma } from '@/lib/prisma';
import { Prisma, type SourceFormat } from '@prisma/client';

class SourceFormatError extends Error {
	constructor(message: string, public readonly cause?: unknown) {
		super(message);
		this.name = 'SourceFormatError';
	}
}

export async function getSourceFormats(): Promise<SourceFormat[]> {
	try {
		const sourceFormats = await prisma.sourceFormat.findMany({
			orderBy: { createdAt: 'desc' },
		});

		return sourceFormats;
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			// Handle specific Prisma errors
			console.error(`Database error: ${error.code}`, error);
			throw new SourceFormatError(`Database error: ${error.message}`);
		}

		if (error instanceof Prisma.PrismaClientValidationError) {
			console.error('Validation error:', error);
			throw new SourceFormatError('Invalid data provided');
		}

		// Generic error handling
		console.error('Error fetching source formats data:', error);
		throw new SourceFormatError(
			'Unable to retrieve source formats data. Please try again later.',
			error
		);
	}
}
