'use server';

import { z } from 'zod';
import { DeleteState, imageSchema, State } from './utils/utils';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Prisma } from '@prisma/client';
import {
	checkFile,
	deleteFile,
	updateFile,
	uploadFile,
} from './utils/s3-image';

const PartnerSchema = z.object({
	name: z
		.string()
		.min(1, 'Partner name is required')
		.max(100, 'Partner name must be 100 characters or less'),
	info: z
		.string()
		.max(1500, 'Partner must be 1500 characters or less')
		.optional(),
	image: imageSchema.shape.file,
	country: z
		.string()
		.min(1, 'Country is required')
		.max(100, 'Country must be 100 characters or less'),
	studioPic: imageSchema.shape.file.optional(),
	website: z.string().url('Invalid website URL').optional(),
	facebook: z.string().url('Invalid Facebook URL').optional(),
	instagram: z.string().url('Invalid Instagram URL').optional(),
	vimeo: z.string().url('Invalid Vimeo URL').optional(),
	linkedin: z.string().url('Invalid LinkedIn URL').optional(),
	youtube: z.string().url('Invalid YouTube URL').optional(),
});

type PartnerData = z.infer<typeof PartnerSchema>;

export type PartnerFormState = State<PartnerData> & {
	prev?: { image?: string | undefined; studioPic?: string | undefined };
};

export async function addPartner(
	prevState: PartnerFormState,
	formData: FormData
): Promise<PartnerFormState> {
	const validatedFields = PartnerSchema.safeParse({
		name: formData.get('name'),
		info: formData.get('info'),
		country: formData.get('country'),
		image: await checkFile(formData.get('image')),
		studioPic: await checkFile(formData.get('studioPic')),
		website: formData.get('website') || undefined,
		facebook: formData.get('facebook') || undefined,
		instagram: formData.get('instagram') || undefined,
		vimeo: formData.get('vimeo') || undefined,
		linkedin: formData.get('linkedin') || undefined,
		youtube: formData.get('youtube') || undefined,
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Failed to add new Partner. Please check the form for errors.',
		};
	}

	const { name, info, image, country, studioPic, ...socialLinksData } =
		validatedFields.data;

	try {
		const imageUrl = await uploadFile(image);
		const studioPicUrl = studioPic ? await uploadFile(studioPic) : undefined;

		// Create social links
		const socialLinks = await prisma.socialLinks.create({
			data: socialLinksData,
		});

		await prisma.partner.create({
			data: {
				name,
				country,
				bio: info,
				studioPic: studioPicUrl,
				picture: imageUrl,
				socialId: socialLinks.id,
			},
		});

		revalidatePath('/', 'layout');
	} catch (error) {
		if (
			error instanceof Prisma.PrismaClientKnownRequestError &&
			error.code === 'P2002'
		) {
			return { message: 'Partner already exists' };
		}
		return { message: 'Failed to create partner' };
	}
	redirect('/user/curated');
}

export async function updatePartner(
	id: string,
	prevState: PartnerFormState,
	formData: FormData
): Promise<PartnerFormState> {
	const validatedFields = PartnerSchema.omit({
		image: true,
		studioPic: true,
	}).safeParse({
		name: formData.get('name'),
		info: formData.get('info'),
		country: formData.get('country'),
		website: formData.get('website') || undefined,
		facebook: formData.get('facebook') || undefined,
		instagram: formData.get('instagram') || undefined,
		vimeo: formData.get('vimeo') || undefined,
		linkedin: formData.get('linkedin') || undefined,
		youtube: formData.get('youtube') || undefined,
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Failed to update Partner. Please check the form for errors.',
		};
	}

	const { name, info, country, ...socialLinksData } = validatedFields.data;

	try {
		const imageUrl = await updateFile(
			formData.get('image'),
			prevState?.prev?.image
		);
		const studioPicUrl = await updateFile(
			formData.get('studioPic'),
			prevState?.prev?.studioPic
		);

		const existingPartner = await prisma.partner.findUnique({
			where: { id },
			select: { socialId: true },
		});

		// Upsert social links
		const socialLink = await prisma.socialLinks.upsert({
			where: { id: existingPartner?.socialId || '' },
			create: socialLinksData,
			update: socialLinksData,
		});

		// Update partner details
		await prisma.partner.update({
			where: { id },
			data: {
				name,
				country,
				bio: info,
				studioPic: studioPicUrl,
				picture: imageUrl,
				socialId: socialLink?.id,
			},
		});

		revalidatePath('/', 'layout');
	} catch (error) {
		console.log(error);

		return { message: 'Failed to update partner' };
	}
	redirect('/user/curated');
}

export async function deletePartner(id: string): Promise<DeleteState> {
	try {
		const partner = await prisma.partner.delete({ where: { id } });

		if (!partner) {
			return { success: false, message: 'Partner not found' };
		}

		// Delete images if they exist
		if (partner.picture) await deleteFile(partner.picture);
		if (partner.studioPic) await deleteFile(partner.studioPic);

		if (partner.socialId) {
			await prisma.socialLinks.delete({ where: { id: partner.socialId } });
		}

		revalidatePath('/', 'layout');
		return { success: true, message: 'Partner deleted successfully' };
	} catch (error) {
		console.error('Delete error:', error);

		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			return {
				success: false,
				message: 'Partner not found or cannot be deleted',
			};
		}

		return { success: false, message: 'Failed to delete partner' };
	}
}
