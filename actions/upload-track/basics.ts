'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { State } from '../utils';
import { convertDateFormat } from '@/lib/utils';
import { auth } from '@/lib/auth';

const TrackSchema = z.object({
	trackName: z
		.string()
		.min(1, 'Track name is required')
		.max(100, 'Track name must be 100 characters or less'),
	// artist: z
	// 	.string()
	// 	.min(1, 'Artist name is required')
	// 	.max(100, 'Artist name must be 100 characters or less'),
	artist: z.array(z.string()).min(1, 'At least one Artist must be selected'),
	releaseYear: z.string().min(1, 'Release year is required'),
	recognitions: z.array(z.string()).optional(),

	curatedBy: z
		.array(z.string())
		.min(1, 'At least one curator must be selected'),
	genreTags: z
		.array(z.string())
		.min(1, 'At least one genre tag is required')
		.max(3, 'You can only select up to 3 genre tags'),
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
	const recognitions = formData
		.getAll('recognitions')
		.filter((r) => r !== '') as string[];
	const curators = formData
		.getAll('curatedBy')
		.filter((c) => c !== '') as string[];

	// const artist = formData.getAll('artist').filter((c) => c !== '') as string[];

	const artist =
		session?.user?.role === 'user'
			? [session?.user?.id]
			: (formData.getAll('artist').filter((c) => c !== '') as string[]);

	const validatedFields = TrackSchema.safeParse({
		trackName: formData.get('trackName'),
		artist: artist,
		releaseYear: formData.get('releaseYear'),
		recognitions: recognitions,
		curatedBy: session?.user?.role === 'user' ? ['audiospace'] : curators,
		genreTags: genreTags,
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
			recognitions,
			curatedBy,
			genreTags,
		} = validatedFields.data;

		console.log('Submitting track:', {
			trackName,
			artist,
			releaseYear: convertDateFormat(new Date(releaseYear)),
			recognitions,
			curatedBy,
			genreTags,
		});

		revalidatePath('/', 'layout');
		return { message: 'Track submitted successfully' };
	} catch (error) {
		console.error('Track submission error:', error);
		return { message: 'Failed to submit track. Please try again.' };
	}
}
