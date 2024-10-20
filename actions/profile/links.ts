'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { State } from '../utils';

// Define the schema for profile update
const ProfileLinksSchema = z.object({
	websiteLink: z.string().url('Invalid website URL').optional().nullable(),
	socialMediaLinks: z
		.array(z.string().url('Invalid social media URL'))
		.max(3, 'You can only add up to 3 social media links'),
	soundingFutureArticles: z
		.array(z.string().url('Invalid article URL'))
		.max(10, 'You can only add up to 10 Sounding Future article links'),
});

type ProfileLinksData = z.infer<typeof ProfileLinksSchema>;

export type ProfileFormState = State<ProfileLinksData>;

export async function updateProfileLinks(
	prevState: ProfileFormState,
	formData: FormData
): Promise<ProfileFormState> {
	const socialMediaLinksData = formData
		.getAll('socialMediaLinks')
		.filter((link) => link !== '') as string[];
	const soundingFutureArticlesData = formData
		.getAll('soundingFutureArticles')
		.filter((link) => link !== '') as string[];

	const validatedFields = ProfileLinksSchema.safeParse({
		websiteLink: formData.get('websiteLink'),
		socialMediaLinks: socialMediaLinksData,
		soundingFutureArticles: soundingFutureArticlesData,
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Failed to update profile. Please check the form for errors.',
		};
	}

	const { websiteLink, socialMediaLinks, soundingFutureArticles } =
		validatedFields.data;

	try {
		console.log('Profile Link:', {
			websiteLink,
			socialMediaLinks,
			soundingFutureArticles,
		});

		revalidatePath('/', 'layout');
		return { message: 'Profile updated successfully' };
	} catch (error) {
		console.error('Profile update error:', error);
		return { message: 'Failed to update profile. Please try again.' };
	}
}
