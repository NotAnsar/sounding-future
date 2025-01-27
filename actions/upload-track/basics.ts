'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { generateSlug, imageSchema, State } from '../utils/utils';
import { auth } from '@/lib/auth';

import { checkFile, updateFile, uploadFile } from '../utils/s3-image';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Prisma } from '@prisma/client';

const TrackSchema = z.object({
	trackName: z
		.string()
		.min(1, 'Track name is required')
		.max(100, 'Track name must be 100 characters or less'),
	releaseYear: z.string().min(1, 'Release year is required'),
	release: z.string().min(1, 'Release is required'),
	genreTags: z
		.array(z.string())
		.min(1, 'At least one genre tag is required')
		.max(3, 'You can only select up to 3 genre tags'),
	sourceFormat: z
		.string()
		.min(1, { message: 'Track Source Format is required' }),
	imageFile: imageSchema.shape.file,

	artist: z.string().min(1, { message: 'You must select an artist' }),
	curatedBy: z
		.string()
		.min(1, { message: 'You must select a curated collection' })
		.optional(),
});

type TrackData = z.infer<typeof TrackSchema>;

export type TrackFormState = State<TrackData> & {
	prev?: { image?: string | undefined; genres?: string[] | undefined };
};

export async function submitTrack(
	_prevState: TrackFormState,
	formData: FormData
): Promise<TrackFormState> {
	const genreTags = formData
		.getAll('genreTags')
		.filter((tag) => tag !== '') as string[];

	const { isUser, artistId, needsArtistProfile } = await checkAuth();

	if (needsArtistProfile) {
		return {
			message:
				'You need to set up an artist profile first. Please visit your artist profile settings to create one before uploading your tracks.',
		};
	}

	const validatedFields = TrackSchema.safeParse({
		trackName: formData.get('trackName'),
		artist: isUser ? artistId : formData.get('artist'),
		imageFile: await checkFile(formData.get('imageFile')),
		curatedBy: formData.get('curatedBy') || undefined,
		genreTags: genreTags,
		releaseYear: formData.get('releaseYear'),
		sourceFormat: formData.get('sourceFormat'),
		release: formData.get('release'),
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Failed to submit track. Please check the form for errors.',
		};
	}

	let trackId: string;
	try {
		const {
			trackName,
			artist,
			releaseYear,
			curatedBy,
			genreTags,
			imageFile,
			sourceFormat,
			release,
		} = validatedFields.data;

		const slug = generateSlug(trackName);
		const imageUrl = await uploadFile(imageFile);

		const sourceFormatData = await prisma.sourceFormat.upsert({
			where: { id: sourceFormat },
			update: {},
			create: { name: sourceFormat },
		});

		const track = await prisma.track.create({
			data: {
				title: trackName,
				releaseYear: +releaseYear,
				artistId: artist,
				cover: imageUrl,
				formatId: sourceFormatData.id,
				releasedBy: release,
				curatedBy: isUser ? undefined : curatedBy,
				slug,
			},
		});

		trackId = track.id;

		await prisma.trackGenre.createMany({
			data: genreTags.map((genreId) => ({ trackId, genreId })),
		});

		revalidatePath('/', 'layout');
	} catch (error) {
		console.error('Track submission error:', error);
		if (
			error instanceof Prisma.PrismaClientKnownRequestError &&
			error.code === 'P2002'
		) {
			// Check if the error is due to name or slug uniqueness
			const target = (error.meta as { target?: string[] })?.target || [];
			if (target.includes('slug')) {
				return { message: 'A track with a similar name already exists' };
			}
			return {
				message: 'Failed to upload track basic info. Please try again.',
			};
		}
		return { message: 'Failed to upload track basic info. Please try again.' };
	}

	redirect(`/user/tracks/upload/${trackId}/info`);
}

export async function updateTrack(
	id: string,
	prevState: TrackFormState,
	formData: FormData
): Promise<TrackFormState> {
	const { isUser, artistId, needsArtistProfile } = await checkAuth();

	if (needsArtistProfile) {
		return {
			message:
				'You need to set up an artist profile first. Please visit your artist profile settings to create one before uploading your tracks.',
		};
	}

	const genreTagsData = formData
		.getAll('genreTags')
		.filter((tag) => tag !== '') as string[];

	const validatedFields = TrackSchema.omit({
		imageFile: true,
	}).safeParse({
		trackName: formData.get('trackName'),
		artist: isUser ? artistId : formData.get('artist'),
		curatedBy: formData.get('curatedBy') || undefined,
		genreTags: genreTagsData,
		releaseYear: formData.get('releaseYear'),
		sourceFormat: formData.get('sourceFormat'),
		release: formData.get('release'),
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Failed to update track. Please check the form for errors.',
		};
	}

	const {
		trackName,
		artist,
		releaseYear,
		curatedBy,
		genreTags,
		sourceFormat,
		release,
	} = validatedFields.data;

	const slug = generateSlug(trackName);

	try {
		const imageFile = formData.get('imageFile');

		if (imageFile instanceof File && imageFile.size > 2 * 1024 * 1024) {
			return {
				message: 'Track cover image must be less than 2MB',
				errors: { imageFile: ['Track cover image must be less than 2MB'] },
			};
		}

		const imageUrl = await updateFile(
			formData.get('imageFile'),
			prevState?.prev?.image
		);

		const sourceFormatData = await prisma.sourceFormat.upsert({
			where: { id: sourceFormat },
			update: {},
			create: { name: sourceFormat },
		});

		await prisma.track.update({
			where: { id },
			data: {
				title: trackName,
				releaseYear: +releaseYear,
				artistId: artist,
				cover: imageUrl,
				formatId: sourceFormatData.id,
				releasedBy: release,
				curatedBy: isUser ? undefined : curatedBy,
				slug,
			},
		});

		const oldGenres = prevState?.prev?.genres || [];

		const genresToAdd = genreTags.filter((id) => !oldGenres.includes(id));
		const genresToRemove = oldGenres.filter((id) => !genreTags.includes(id));

		// Add new genres
		if (genresToAdd.length > 0) {
			await prisma.trackGenre.createMany({
				data: genresToAdd.map((genreId) => ({ trackId: id, genreId })),
			});
		}

		// Remove old genres
		if (genresToRemove.length > 0) {
			await prisma.trackGenre.deleteMany({
				where: {
					trackId: id,
					genreId: { in: genresToRemove },
				},
			});
		}

		revalidatePath('/', 'layout');
	} catch (error) {
		console.error('Track update error:', error);
		if (
			error instanceof Prisma.PrismaClientKnownRequestError &&
			error.code === 'P2002'
		) {
			return { message: 'A Track with this name already exists' };
		}

		return { message: 'Failed to update track info. Please try again.' };
	}

	redirect(`/user/tracks/upload/${id}/info`);
}

export async function checkAuth() {
	const session = await auth();
	const isUser = session?.user?.role === 'user';
	const artistId = session?.user?.artistId;

	return {
		isUser,
		artistId,
		needsArtistProfile: isUser && !artistId,
	};
}
