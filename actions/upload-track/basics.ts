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
	trackRegistration: z
		.string()
		.min(1, 'Track Registration is required')
		.optional(),
	genreTags: z
		.array(z.string())
		.min(1, 'At least one genre tag is required')
		.max(3, 'You can only select up to 3 genre tags'),
	sourceFormat: z
		.string()
		.min(1, { message: 'Track Source Format is required' }),
	imageFile: imageSchema.shape.file,

	artists: z
		.array(z.string())
		.min(1, 'At least one Artist is required')
		.max(4, 'You can only select up to 4 Artists'),
	curatedBy: z
		.string()
		.min(1, { message: 'You must select a curated collection' })
		.optional(),
	isrcCode: z
		.string()
		.min(1, {
			message:
				'You must select the ISRC (International Standard Recording Code)',
		})
		.optional(),
});

type TrackData = z.infer<typeof TrackSchema>;

export type TrackFormState = State<TrackData> & {
	prev?: {
		image?: string | undefined;
		genres?: string[] | undefined;
		artists?: string[] | undefined;
	};
};

export async function submitTrack(
	_prevState: TrackFormState,
	formData: FormData
): Promise<TrackFormState> {
	const genreTags = formData
		.getAll('genreTags')
		.filter((tag) => tag !== '') as string[];

	const artists = formData
		.getAll('artists')
		.filter((artist) => artist !== '') as string[];

	const { isUser, artistId, needsArtistProfile, user } = await checkAuth();

	if (needsArtistProfile) {
		return {
			message:
				'You need to set up an artist profile first. Please visit your artist profile settings to create one before uploading your tracks.',
		};
	}

	// For non-admin users, ensure their artist ID is used
	const artistsToUse = isUser ? (artistId ? [artistId] : []) : artists;

	if (artistsToUse.length === 0) {
		return {
			errors: { artists: ['At least one artist is required'] },
			message: 'Failed to submit track. Please check the form for errors.',
		};
	}

	// Check track limit for the user's artist
	if (artistId) {
		const trackCount = await prisma.track.count({
			where: {
				artists: { some: { artistId } },
			},
		});

		if (user?.role === 'user' && trackCount >= 3) {
			return {
				message:
					'Free users can upload a maximum of 3 tracks. Please upgrade to a Pro account for more uploads.',
			};
		} else if (user?.role === 'pro' && trackCount >= 20) {
			return {
				message: 'Pro users can upload a maximum of 20 tracks.',
			};
		}
	}

	const validatedFields = TrackSchema.safeParse({
		trackName: formData.get('trackName'),
		artists: artistsToUse,
		imageFile: await checkFile(formData.get('imageFile')),
		curatedBy: formData.get('curatedBy') || undefined,
		genreTags: genreTags,
		releaseYear: formData.get('releaseYear'),
		sourceFormat: formData.get('sourceFormat'),
		release: formData.get('release'),
		trackRegistration: formData.get('trackRegistration'),
		isrcCode: formData.get('isrcCode') || undefined,
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
			trackRegistration,
			trackName,
			artists,
			releaseYear,
			curatedBy,
			genreTags,
			imageFile,
			sourceFormat,
			release,
			isrcCode,
		} = validatedFields.data;

		const slug = generateSlug(trackName);
		const imageUrl = await uploadFile(imageFile);

		const sourceFormatData = await prisma.sourceFormat.upsert({
			where: { id: sourceFormat },
			update: {},
			create: { name: sourceFormat },
		});

		// Create the track with the primary artist
		const track = await prisma.track.create({
			data: {
				title: trackName,
				isrcCode,
				releaseYear: +releaseYear,
				cover: imageUrl,
				formatId: sourceFormatData.id,
				releasedBy: release,
				curatedBy: isUser ? undefined : curatedBy,
				slug,
				trackRegistration:
					trackRegistration === 'NOT_REGISTERED' ? null : trackRegistration,
				artists: {
					createMany: {
						data: artists.map((artistId, index) => ({
							artistId,
							isPrimary: true,
							order: index,
						})),
					},
				},

				genres: {
					createMany: {
						data: genreTags.map((genreId) => ({ genreId })),
					},
				},
			},
		});

		trackId = track.id;

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
	const { isUser, artistId, needsArtistProfile, user } = await checkAuth();
	const isAdmin = user?.role === 'admin';

	if (needsArtistProfile) {
		return {
			message:
				'You need to set up an artist profile first. Please visit your artist profile settings to create one before uploading your tracks.',
		};
	}

	const genreTagsData = formData
		.getAll('genreTags')
		.filter((tag) => tag !== '') as string[];

	// Only process artists data if user is admin
	const artistsData = isAdmin
		? (formData.getAll('artists').filter((artist) => artist !== '') as string[])
		: [];

	// If user is not admin, get current track's artists to preserve them
	let currentArtists: string[] = [];
	if (!isAdmin) {
		const track = await prisma.track.findUnique({
			where: { id },
			include: { artists: true },
		});

		if (track) {
			currentArtists = track.artists.map((a) => a.artistId);
		}
	}

	// For non-admin users, preserve existing artists or use their artistId
	const artistsToUse = isAdmin
		? artistsData
		: currentArtists.length > 0
		? currentArtists
		: artistId
		? [artistId]
		: [];

	if (artistsToUse.length === 0) {
		return {
			errors: { artists: ['At least one artist is required'] },
			message: 'Failed to update track. Please check the form for errors.',
		};
	}

	const validatedFields = TrackSchema.omit({
		imageFile: true,
	}).safeParse({
		trackName: formData.get('trackName'),
		artists: artistsToUse,
		curatedBy: formData.get('curatedBy') || undefined,
		genreTags: genreTagsData,
		releaseYear: formData.get('releaseYear'),
		sourceFormat: formData.get('sourceFormat'),
		release: formData.get('release'),
		trackRegistration: formData.get('trackRegistration'),
		isrcCode: formData.get('isrcCode') || undefined,
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Failed to update track. Please check the form for errors.',
		};
	}

	const {
		trackName,
		artists,
		releaseYear,
		curatedBy,
		genreTags,
		sourceFormat,
		release,
		trackRegistration,
		isrcCode,
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

		// Update the track with the primary artist
		await prisma.track.update({
			where: { id },
			data: {
				title: trackName,
				releaseYear: +releaseYear,
				cover: imageUrl,
				formatId: sourceFormatData.id,
				releasedBy: release,
				curatedBy: isUser ? undefined : curatedBy ? curatedBy : null,
				slug,
				trackRegistration:
					trackRegistration === 'NOT_REGISTERED' ? null : trackRegistration,
				isrcCode: isrcCode ? isrcCode : null,
			},
		});

		// Handle genres
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

		// Only allow admins to modify artists
		if (isAdmin) {
			// Delete all existing artist connections and recreate them
			await prisma.trackArtist.deleteMany({
				where: {
					trackId: id,
				},
			});

			// Create all artist connections with all artists as primary
			await prisma.trackArtist.createMany({
				data: artists.map((artistId, index) => ({
					trackId: id,
					artistId,
					isPrimary: true, // All artists are primary
					order: index,
				})),
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
	const isUser = session?.user?.role !== 'admin';
	const artistId = session?.user?.artistId;

	return {
		isUser,
		artistId,
		needsArtistProfile: isUser && !artistId,
		user: session?.user,
	};
}
