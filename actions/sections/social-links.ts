'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { State } from '../utils/utils';
import { prisma } from '@/lib/prisma';

const SocialLinksSchema = z.object({
	websiteLink: z.string().url('Invalid website URL').optional().nullable(),
	facebook: z.string().url('Invalid Facebook URL').optional().nullable(),
	instagram: z.string().url('Invalid Instagram URL').optional().nullable(),
	linkedin: z.string().url('Invalid LinkedIn URL').optional().nullable(),
	youtube: z.string().url('Invalid YouTube URL').optional().nullable(),
	mastodon: z.string().url('Invalid Mastodon URL').optional().nullable(),
});

type SocialLinksData = z.infer<typeof SocialLinksSchema>;

export type SocialLinksState = State<SocialLinksData> & {
	success?: boolean;
};

export async function updateSocialLinks(
	prevState: SocialLinksState,
	formData: FormData
): Promise<SocialLinksState> {
	const id = 'cm5jsbxc80000yteee6i2hr45';

	const processedData = {
		websiteLink: formData.get('websiteLink')?.toString() || null,
		facebook: formData.get('facebook')?.toString() || null,
		instagram: formData.get('instagram')?.toString() || null,
		linkedin: formData.get('linkedin')?.toString() || null,
		youtube: formData.get('youtube')?.toString() || null,
		mastodon: formData.get('mastodon')?.toString() || null,
	};

	const validatedFields = SocialLinksSchema.safeParse(processedData);

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message:
				'Failed to update social links section. Please check the form for errors.',
		};
	}

	const { websiteLink, facebook, instagram, linkedin, youtube, mastodon } =
		validatedFields.data;

	try {
		await prisma.socialLinks.update({
			where: { id },
			data: {
				website: websiteLink,
				facebook,
				instagram,
				linkedin,
				youtube,
				mastodon,
			},
		});

		revalidatePath('/', 'layout');
		return { success: true };
	} catch (error) {
		console.error('social links section error:', error);
		return {
			message: 'Failed to update social links section. Please try again.',
			success: false,
		};
	}
}
