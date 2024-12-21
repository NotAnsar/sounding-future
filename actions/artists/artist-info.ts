'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { imageSchema, State } from '../utils/utils';
import { checkFile, updateFile, uploadFile } from '../utils/s3-image';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

const ArtistSchema = z.object({
	name: z
		.string()
		.min(1, 'Artist name is required')
		.max(100, 'Artist name must be 100 characters or less'),
	biography: z
		.string()
		.max(1000, 'Biography must be 1000 characters or less')
		.optional(),
	genres: z
		.array(z.string())
		.min(1, 'At least one genre tag is required')
		.max(3, 'You can only select up to 3 genre tags'),
	image: imageSchema.shape.file,
	published: z.boolean().default(false),
});

type ArtistData = z.infer<typeof ArtistSchema>;

export type ArtistFormState = State<ArtistData> & {
	prev?: { image?: string; genres?: string[] | undefined };
	success?: boolean;
};

export async function createArtist(
	prevState: ArtistFormState,
	formData: FormData
): Promise<ArtistFormState> {
	const genresData = formData
		.getAll('genres')
		.filter((genre) => genre !== '') as string[];

	const image = await checkFile(formData.get('image'));
	const validatedFields = ArtistSchema.safeParse({
		name: formData.get('name'),
		biography: formData.get('biography'),
		genres: genresData,
		image,
		published: formData.get('published') === 'true',
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Failed to create artist. Please check the form for errors.',
		};
	}

	let artistId: string;
	try {
		const session = await auth();
		if (!session?.user) {
			throw new Error('User not authenticated');
		}

		const { name, biography, genres, published, image } = validatedFields.data;
		if (image instanceof File && image.size > 2 * 1024 * 1024) {
			return {
				message: 'Artist Profile image must be less than 2MB',
				errors: { image: ['Artist Profile image must be less than 2MB'] },
			};
		}
		const imageUrl = await uploadFile(image);

		const artist = await prisma.$transaction(async (tx) => {
			const artist = await tx.artist.create({
				data: { name, bio: biography, pic: imageUrl, published },
			});

			await tx.artistGenre.createMany({
				data: genres.map((genreId) => ({ artistId: artist.id, genreId })),
			});

			return artist;
		});

		artistId = artist.id;
		revalidatePath('/', 'layout');
	} catch (error) {
		console.error('Artist creation error:', error);
		return { message: 'Failed to create artist. Please try again.' };
	}
	redirect(`/user/artists/links/${artistId}`);
}

export async function updateArtist(
	id: string,
	prevState: ArtistFormState,
	formData: FormData
): Promise<ArtistFormState> {
	const genresData = formData
		.getAll('genres')
		.filter((genre) => genre !== '') as string[];
	const validatedFields = ArtistSchema.omit({ image: true }).safeParse({
		name: formData.get('name'),
		biography: formData.get('biography'),
		genres: genresData,
		published: formData.get('published') === 'true',
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Failed to update artist. Please check the form for errors.',
		};
	}

	const image = formData.get('image');
	if (image instanceof File && image.size > 2 * 1024 * 1024) {
		return {
			message: 'Artist image must be less than 2MB',
			errors: { image: ['Artist image must be less than 2MB'] },
		};
	}

	try {
		const { name, biography, genres, published } = validatedFields.data;
		const imageUrl = await updateFile(image, prevState?.prev?.image);
		const artist = await prisma.artist.update({
			where: { id },
			data: {
				name,
				bio: biography,
				pic: imageUrl,
				published,
			},
		});

		const oldGenres = prevState?.prev?.genres || [];
		const genresToAdd = genres.filter((id) => !oldGenres.includes(id));
		const genresToRemove = oldGenres.filter((id) => !genres.includes(id));
		console.log('oldGenres:', oldGenres);
		console.log('genresToAdd:', genresToAdd);
		console.log('genresToRemove:', genresToRemove);

		await prisma.$transaction(async (tx) => {
			if (genresToAdd.length > 0) {
				await tx.artistGenre.createMany({
					data: genresToAdd.map((genreId) => ({
						artistId: artist.id,
						genreId,
					})),
				});
			}

			if (genresToRemove.length > 0) {
				await tx.artistGenre.deleteMany({
					where: { artistId: artist.id, genreId: { in: genresToRemove } },
				});
			}
		});

		revalidatePath('/');
	} catch (error) {
		console.error('Artist update error:', error);
		return { message: 'Failed to update artist. Please try again.' };
	}
	redirect(`/user/artists/links/${id}`);
}
