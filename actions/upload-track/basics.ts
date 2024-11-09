'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { State } from '../utils';
import { convertDateFormat } from '@/lib/utils';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

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
	imageFile: z
		.instanceof(File)
		.refine((file) => {
			return file.type === 'image/jpeg' || file.type === 'image/jpg';
		}, 'Image must be in JPG format')
		.refine((file) => {
			return file.size <= 5 * 1024 * 1024;
		}, 'Image must be less than 5MB'),

	// admin
	artist: z
		.string()
		.min(1, { message: 'You must select an artist' })
		.optional(),
	curatedBy: z
		.string()
		.min(1, { message: 'You must select a curated collection' })
		.optional(),
});

type TrackData = z.infer<typeof TrackSchema>;

export type TrackFormState = State<TrackData>;

export async function submitTrack(
	prevState: TrackFormState,
	formData: FormData
): Promise<TrackFormState> {
	const session = await auth();

	const genreTags = formData
		.getAll('genreTags')
		.filter((tag) => tag !== '') as string[];

	const artist =
		session?.user?.role === 'user' ? session?.user?.id : formData.get('artist');
	const curatedBy =
		session?.user?.role === 'user' ? undefined : formData.get('curatedBy');

	const validatedFields = TrackSchema.safeParse({
		trackName: formData.get('trackName'),
		artist,
		imageFile: formData.get('imageFile'),
		curatedBy,
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

		console.log('Submitting track:', {
			trackName,
			artist,
			releaseYear: convertDateFormat(new Date(releaseYear)),
			curatedBy,
			genreTags,
			imageFile,
			sourceFormat,
			release,
		});

		revalidatePath('/', 'layout');
	} catch (error) {
		console.error('Track submission error:', error);
		return { message: 'Failed to upload track basic info. Please try again.' };
	}

	redirect(`/user/tracks/upload/${Math.floor(Math.random() * 100)}/info`);
}
