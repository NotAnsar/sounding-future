'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { State } from '../utils/utils';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// Define the schema for profile update
const ProfileLinksSchema = z.object({
	websiteLink: z.string().url('Invalid website URL').optional(),
	facebook: z.string().url('Invalid Facebook URL').optional(),
	instagram: z.string().url('Invalid Instagram URL').optional(),
	linkedin: z.string().url('Invalid LinkedIn URL').optional(),
	youtube: z.string().url('Invalid YouTube URL').optional(),
	soundingFutureArticles: z
		.array(z.string().url('Invalid article URL'))
		.max(10, 'You can only add up to 10 Sounding Future article links'),
});

type ProfileLinksData = z.infer<typeof ProfileLinksSchema>;

export type ProfileFormState = State<ProfileLinksData> & {
	prev?: { articles?: string[] };
	success?: boolean;
};

export async function updateProfileLinks(
	prevState: ProfileFormState,
	formData: FormData
): Promise<ProfileFormState> {
	const soundingFutureArticlesData = formData
		.getAll('soundingFutureArticles')
		.filter((link) => link !== '') as string[];

	const validatedFields = ProfileLinksSchema.safeParse({
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
			message: 'Failed to update profile. Please check the form for errors.',
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
		const session = await auth();
		const artistId = session?.user?.artistId;
		if (!artistId) {
			return {
				message:
					'You need to set up an artist profile first. Please visit your profile settings to create one before managing your links.',
			};
		}

		const socialLinks = await prisma.artist.findUnique({
			where: { id: artistId },
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
			// Create new social links
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
				where: { id: artistId },
				data: { socialId: newSocialLinks.id },
			});
		}

		// Handle article links
		// Delete old articles if they exist
		if (prevState.prev?.articles?.length) {
			await prisma.artistArticle.deleteMany({
				where: {
					artistId: artistId,
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
					data: { artistId: artistId, articleId: article.id },
				});

				return article;
			});

			await Promise.all(articlePromises);
		}

		revalidatePath('/', 'layout');
		return { success: true };
	} catch (error) {
		console.error('Profile update error:', error);
		return { message: 'Failed to update artist links. Please try again.' };
	}
}
