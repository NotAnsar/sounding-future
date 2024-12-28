'use server';

import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { imageSchema, State } from './utils/utils';
import { checkFile, updateFile, uploadFile } from './utils/s3-image';
import { redirect } from 'next/navigation';

const formSchema = z.object({
	title: z.string().min(2, 'Title must be at least 2 characters').trim(),
	description: z.string().min(2, 'Description is required').trim(),
	backgroundColor: z
		.string()
		.regex(
			/^#([0-9A-F]{3}){1,2}$/i,
			'Background color must be a valid hex code'
		)
		.trim(),
	backgroundImage: imageSchema.shape.file.optional(),
	buttonText: z.string().min(2, 'Button text is required').trim(),
	link: z.string().url('Must be a valid URL').trim(),
	published: z.boolean().default(false),
});

type BannerData = z.infer<typeof formSchema>;

export type BannerState =
	| (State<BannerData> & {
			prev?: { backgroundImage?: string | undefined };
	  })
	| undefined;

export async function createBanner(
	prevState: BannerState,
	formData: FormData
): Promise<BannerState> {
	const validatedFields = formSchema.safeParse({
		title: formData.get('title'),
		description: formData.get('description'),
		backgroundColor: formData.get('backgroundColor'),
		buttonText: formData.get('buttonText'),
		link: formData.get('link'),
		published: formData.get('published') === 'true',
		backgroundImage: await checkFile(formData.get('backgroundImage')),
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Invalid data. Unable to create banner.',
		};
	}
	const { backgroundImage, ...rest } = validatedFields.data;

	try {
		const backgroundImageUrl = backgroundImage
			? await uploadFile(backgroundImage)
			: undefined;

		await prisma.banner.create({
			data: { ...rest, backgroundImage: backgroundImageUrl },
		});
		revalidatePath('/', 'layout');
	} catch (error) {
		return { message: 'Failed to create banner' };
	}
	redirect('/user/banners');
}

export async function updateBanner(
	id: string,
	prevState: BannerState,
	formData: FormData
) {
	const validatedFields = formSchema.omit({ backgroundImage: true }).safeParse({
		title: formData.get('title'),
		description: formData.get('description'),
		backgroundColor: formData.get('backgroundColor'),
		buttonText: formData.get('buttonText'),
		link: formData.get('link'),
		published: formData.get('published') === 'true',
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Invalid data. Unable to update banner.',
		};
	}

	try {
		const backgroundImage = formData.get('backgroundImage');

		if (
			backgroundImage instanceof File &&
			backgroundImage.size > 2 * 1024 * 1024
		) {
			return {
				message: 'Background image must be less than 2MB',
				errors: { backgroundImage: ['Background image must be less than 2MB'] },
			};
		}

		const backgroundImageUrl = await updateFile(
			backgroundImage,
			prevState?.prev?.backgroundImage
		);

		await prisma.banner.update({
			where: { id },
			data: { ...validatedFields.data, backgroundImage: backgroundImageUrl },
		});
		revalidatePath('/', 'layout');
	} catch (error) {
		return { message: 'Failed to update banner' };
	}
	redirect('/user/banners');
}

export type DeleteBannerState = {
	message?: string | null;
	success?: boolean;
};

export async function deleteBanner(id: string): Promise<DeleteBannerState> {
	try {
		await prisma.banner.delete({ where: { id } });
		revalidatePath('/', 'layout');
		return { success: true, message: 'Banner deleted successfully' };
	} catch (error) {
		console.error('Delete error:', error);

		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			return {
				success: false,
				message: 'Banner not found or cannot be deleted',
			};
		}

		return { success: false, message: 'Failed to delete banner' };
	}
}
