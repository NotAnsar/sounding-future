import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

class ArticleError extends Error {
	constructor(message: string, public readonly cause?: unknown) {
		super(message);
		this.name = 'ArticleError';
	}
}

export type myArticles = Prisma.ArtistArticleGetPayload<{
	include: { article: true };
}>;

export async function getMyArticle(): Promise<{
	artistError: boolean;
	data: myArticles[];
}> {
	const session = await auth();
	const artistId = session?.user?.artistId;

	try {
		if (!artistId) {
			return { artistError: true, data: [] };
		}

		const data = await prisma.artistArticle.findMany({
			where: { artistId },
			include: { article: true },
		});

		return { artistError: false, data };
	} catch (error) {
		if (error instanceof ArticleError) {
			throw new ArticleError(
				'You need to set up an artist profile first. Please visit your profile settings to create one before managing your links.'
			);
		}

		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			// Handle specific Prisma errors
			console.error(`Database error: ${error.code}`, error);
			throw new ArticleError(`Database error: ${error.message}`);
		}

		if (error instanceof Prisma.PrismaClientValidationError) {
			console.error('Validation error:', error);
			throw new ArticleError('Invalid data provided');
		}

		// Generic error handling
		console.error('Error fetching genres:', error);
		throw new ArticleError(
			'Unable to retrieve genres. Please try again later.',
			error
		);
	}
}
