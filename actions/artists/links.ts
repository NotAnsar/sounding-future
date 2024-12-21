'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { State } from '../utils/utils';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

const ArtistLinksSchema = z.object({
	websiteLink: z.string().url('Invalid website URL').optional(),
	facebook: z.string().url('Invalid Facebook URL').optional(),
	instagram: z.string().url('Invalid Instagram URL').optional(),
	linkedin: z.string().url('Invalid LinkedIn URL').optional(),
	youtube: z.string().url('Invalid YouTube URL').optional(),
	soundingFutureArticles: z
		.array(z.string().url('Invalid article URL'))
		.max(10, 'You can only add up to 10 Sounding Future article links'),
});

type ArtistLinksData = z.infer<typeof ArtistLinksSchema>;

export type ArtistFormState = State<ArtistLinksData> & {
	prev?: { articles?: string[] };
	success?: boolean;
};

export async function updateArtistLinks(
	id: string,
	prevState: ArtistFormState,
	formData: FormData
): Promise<ArtistFormState> {
	const soundingFutureArticlesData = formData
		.getAll('soundingFutureArticles')
		.filter((link) => link !== '') as string[];

	const validatedFields = ArtistLinksSchema.safeParse({
		websiteLink: formData.get('websiteLink') || undefined,
		facebook: formData.get('facebook') || undefined,
		instagram: formData.get('instagram') || undefined,
		linkedin: formData.get('linkedin') || undefined,
		youtube: formData.get('youtube') || undefined,
		soundingFutureArticles: soundingFutureArticlesData,
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message:
				'Failed to update artist links. Please check the form for errors.',
		};
	}

	const {
		websiteLink,
		facebook,
		instagram,
		linkedin,
		youtube,
		soundingFutureArticles,
	} = validatedFields.data;

	try {
		const socialLinks = await prisma.artist.findUnique({
			where: { id },
			include: { socialLinks: true },
		});

		if (socialLinks?.socialLinks) {
			// Update existing social links
			await prisma.socialLinks.update({
				where: { id: socialLinks.socialLinks.id },
				data: {
					website: websiteLink,
					facebook,
					instagram,
					linkedin,
					youtube,
				},
			});
		} else {
			const newSocialLinks = await prisma.socialLinks.create({
				data: {
					website: websiteLink,
					facebook,
					instagram,
					linkedin,
					youtube,
				},
			});

			// Connect social links to artist
			await prisma.artist.update({
				where: { id },
				data: { socialId: newSocialLinks.id },
			});
		}

		// Handle article links
		// Delete old articles if they exist
		if (prevState.prev?.articles?.length) {
			await prisma.artistArticle.deleteMany({
				where: {
					artistId: id,
					articleId: { in: prevState.prev.articles },
				},
			});
		}

		// Create new article links and connect them to the artist
		if (soundingFutureArticles.length > 0) {
			const articlePromises = soundingFutureArticles.map(async (url) => {
				const article = await prisma.articleLink.create({
					data: { url },
				});

				await prisma.artistArticle.create({
					data: { artistId: id, articleId: article.id },
				});

				return article;
			});

			await Promise.all(articlePromises);
		}

		revalidatePath('/', 'layout');
	} catch (error) {
		console.error('Artist update error:', error);
		return { message: 'Failed to update artist links. Please try again.' };
	}
	redirect(`/user/artists`);
}
