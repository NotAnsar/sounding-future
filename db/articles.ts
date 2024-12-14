import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// class ArticleError extends Error {
// 	constructor(message: string, public readonly cause?: unknown) {
// 		super(message);
// 		this.name = 'ArticleError';
// 	}
// }

export type myArticles = Prisma.ArtistArticleGetPayload<{
	include: { article: true };
}>;

export async function getMyArticle(): Promise<{
	data: myArticles[];
	error?: boolean;
	message?: string;
}> {
	const session = await auth();
	const artistId = session?.user?.artistId;

	try {
		if (!artistId) {
			return {
				error: true,
				data: [],
				message:
					'You need to set up an artist profile first. Please visit your profile settings to create one before managing your links.',
			};
		}

		const data = await prisma.artistArticle.findMany({
			where: { artistId },
			include: { article: true },
		});

		return { error: false, data };
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			// Handle specific Prisma errors
			console.error(`Database error: ${error.code}`, error);
			// throw new ArticleError(`Database error: ${error.message}`);
			return { error: true, data: [], message: 'Database error' };
		}

		if (error instanceof Prisma.PrismaClientValidationError) {
			console.error('Validation error:', error);
			// throw new ArticleError('Invalid data provided');
			return { error: true, data: [], message: 'Invalid data provided' };
		}

		// Generic error handling
		console.error('Error fetching articles:', error);
		// throw new ArticleError(
		// 	'Unable to retrieve articles. Please try again later.',
		// 	error
		// );
		return { error: true, data: [], message: 'Unable to retrieve articles' };
	}
}
