'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { State } from '../utils/utils';
import { updateFile } from '../utils/s3-image';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Define the schema for profile update
const ProfileSchema = z.object({
	name: z
		.string()
		.min(1, 'Artist name is required')
		.max(100, 'Artist name must be 100 characters or less'),
	biography: z
		.string()
		.max(500, 'Biography must be 500 characters or less')
		.optional(),
	genres: z.array(z.string()).max(3, 'You can only select up to 3 genre tags'),
	image: z.instanceof(File).optional(),
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

	const { name, biography, genres } = validatedFields.data;

	try {
		const session = await auth();
		if (!session?.user) {
			throw new Error('User not authenticated');
		}

		const imageUrl = await updateFile(
			formData.get('image'),
			prevState?.prev?.image
		);

		const artist = await prisma.artist.upsert({
			where: { id: session?.user?.artistId || '' },
			create: {
				name,
				bio: biography,
				pic: imageUrl,
			},
			update: {
				name,
				bio: biography,
				pic: imageUrl,
			},
		});

		const oldGenres = prevState?.prev?.genres || [];
		const genresToAdd = genres.filter((id) => !oldGenres.includes(id));
		const genresToRemove = oldGenres.filter((id) => !genres.includes(id));

		// Add new genres
		if (genresToAdd.length > 0) {
			await prisma.artistGenre.createMany({
				data: genresToAdd.map((genreId) => ({ artistId: artist.id, genreId })),
			});
		}

		// Remove old genres
		if (genresToRemove.length > 0) {
			await prisma.artistGenre.deleteMany({
				where: { artistId: artist.id, genreId: { in: genresToRemove } },
			});
		}

		if (!session?.user?.artistId) {
			await prisma.user.update({
				where: { id: session?.user?.id },
				data: { artistId: artist.id },
			});
		}

		revalidatePath('/', 'layout');
		return { success: true };
	} catch (error) {
		console.error('Profile update error:', error);
		return { message: 'Failed to update profile. Please try again.' };
	}
}
