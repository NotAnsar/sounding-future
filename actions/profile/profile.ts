'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { generateSlug, imageSchema, State } from '../utils/utils';
import { checkFile, updateFile } from '../utils/s3-image';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// Define the schema for profile update
const ProfileSchema = z.object({
	name: z
		.string()
		.min(1, 'Artist name is required')
		.max(100, 'Artist name must be 100 characters or less'),
	biography: z
		.string()
		.max(1500, 'Biography must be 1000 characters or less')
		.optional(),
	genres: z.array(z.string()).max(3, 'You can only select up to 3 genre tags'),
	image: imageSchema.shape.file.optional(),
});

type ProfileData = z.infer<typeof ProfileSchema>;

export type ProfileFormState = State<ProfileData> & {
	prev?: { image?: string; genres?: string[] | undefined };
	success?: boolean;
};

export async function updateProfile(
	prevState: ProfileFormState,
	formData: FormData
): Promise<ProfileFormState> {
	console.log('hi');

	const genresData = formData
		.getAll('genres')
		.filter((genre) => genre !== '') as string[];
	const validatedFields = ProfileSchema.omit({ image: true }).safeParse({
		name: formData.get('name'),
		biography: formData.get('biography'),
		genres: genresData,
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Failed to update profile. Please check the form for errors.',
		};
	}

	const image = await checkFile(formData.get('image'));

	console.log(image, prevState.prev?.image);

	if (!image && !prevState.prev?.image) {
		return {
			message: 'Artist Profile image is required',
			errors: { image: ['Artist Profile image is required'] },
		};
	}

	if (image instanceof File && image.size > 2 * 1024 * 1024) {
		return {
			message: 'Artist Profile image must be less than 2MB',
			errors: { image: ['Artist Profile image must be less than 2MB'] },
		};
	}

	const { name, biography, genres } = validatedFields.data;

	try {
		const session = await auth();
		if (!session?.user) {
			throw new Error('User not authenticated');
		}

		const imageUrl = await updateFile(image || null, prevState?.prev?.image);
		const slug = generateSlug(name);
		const artist = await prisma.artist.upsert({
			where: { id: session?.user?.artistId || '' },
			create: { name, bio: biography, pic: imageUrl, slug },
			update: { name, bio: biography, pic: imageUrl, slug },
		});

		const oldGenres = prevState?.prev?.genres || [];
		const genresToAdd = genres.filter((id) => !oldGenres.includes(id));
		const genresToRemove = oldGenres.filter((id) => !genres.includes(id));

		await prisma.$transaction(async (tx) => {
			// Add new genres
			if (genresToAdd.length > 0) {
				await tx.artistGenre.createMany({
					data: genresToAdd.map((genreId) => ({
						artistId: artist.id,
						genreId,
					})),
				});
			}

			// Remove old genres
			if (genresToRemove.length > 0) {
				await tx.artistGenre.deleteMany({
					where: { artistId: artist.id, genreId: { in: genresToRemove } },
				});
			}

			if (!session?.user?.artistId) {
				await tx.user.update({
					where: { id: session?.user?.id },
					data: { artistId: artist.id },
				});
			}
		});

		revalidatePath('/', 'layout');
		return { success: true };
	} catch (error) {
		console.error('Profile update error:', error);
		if (
			error instanceof Prisma.PrismaClientKnownRequestError &&
			error.code === 'P2002'
		) {
			const target = (error.meta as { target?: string[] })?.target || [];
			if (target.includes('slug')) {
				return { message: 'An Artist with a similar name already exists' };
			}
		}

		return { message: 'Failed to update profile. Please try again.' };
	}
}
