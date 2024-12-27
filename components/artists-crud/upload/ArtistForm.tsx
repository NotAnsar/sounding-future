'use client';

import ErrorMessage from '@/components/ErrorMessage';
import ImageUpload from '@/components/profile/ImageUpload';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import { Textarea } from '@/components/ui/textarea';
import { myArtistData } from '@/db/artist';
import { cn } from '@/lib/utils';
import { Genre } from '@prisma/client';
import { useFormState } from 'react-dom';
import ArtistNav from './ArtistNav';
import {
	ArtistFormState,
	createArtist,
	updateArtist,
} from '@/actions/artists/artist-info';
import { TrackPublishToggle } from '@/components/TrackPublishToggle';

const MaxChar = 1000;

export default function ArtistForm({
	initialData,
	genres,
}: {
	initialData?: myArtistData;
	genres: Genre[];
}) {
	const initialState: ArtistFormState = {
		message: null,
		errors: {},
		prev: {
			image: initialData?.pic || undefined,
			genres: initialData?.genres.map((g) => g.genreId),
		},
	};
	const [state, action] = useFormState(
		initialData?.id ? updateArtist.bind(null, initialData.id) : createArtist,
		initialState
	);
	console.log(initialData?.genres.map((g) => g.genreId) || undefined);

	return (
		<form action={action} className='mt-4 sm:mt-8 grid sm:gap-3'>
			<ArtistNav id={initialData?.id} />
			<div className='lg:w-2/3 mt-2 grid gap-6'>
				<ErrorMessage errors={state?.message ? [state?.message] : undefined} />
				<div className='grid gap-2'>
					<Label
						htmlFor='name'
						className={cn(state?.errors?.name ? 'text-destructive' : '')}
					>
						Artist name
					</Label>
					<Input
						type='text'
						name='name'
						id='name'
						defaultValue={initialData?.name}
						className={cn(
							'max-w-lg',
							state?.errors?.name
								? 'border-destructive focus-visible:ring-destructive '
								: ''
						)}
					/>
					<p className='text-muted text-sm max-w-lg'>
						Your artist name (visible and searchable for other users)
					</p>
					<ErrorMessage errors={state?.errors?.name} />
				</div>
				<ImageUpload
					name='image'
					error={state?.errors?.image}
					initialData={initialData?.pic || undefined}
					size='xl'
				/>
				<div className='grid gap-2'>
					<Label
						htmlFor='biography'
						className={cn(state?.errors?.biography ? 'text-destructive' : '')}
					>
						Artist Biography
					</Label>
					<Textarea
						className={cn(
							'max-w-lg min-h-72',
							state?.errors?.biography
								? 'border-destructive focus-visible:ring-destructive '
								: ''
						)}
						maxLength={MaxChar}
						name='biography'
						id='biography'
						defaultValue={initialData?.bio || undefined}
					/>
					<p className='text-muted text-sm max-w-lg'>
						Max. {MaxChar} characters
					</p>
					<ErrorMessage errors={state?.errors?.biography} />
				</div>

				<div className='grid gap-2'>
					<Label
						className={cn(state?.errors?.genres ? 'text-destructive' : '')}
						htmlFor={'genreTags'}
					>
						Artist genre tags
					</Label>
					<MultiSelect
						options={genres.map((g) => ({ label: g.name, value: g.id }))}
						name='genres'
						placeholder='Select genre tags'
						searchPlaceholder='Search genre tags...'
						emptyMessage='No genre tag found.'
						initialValue={
							initialData?.genres
								? initialData?.genres.map((g) => g.genreId)
								: undefined
						}
						className={cn(
							'max-w-lg',
							state?.errors?.genres
								? 'border-destructive focus-visible:ring-destructive '
								: ''
						)}
					/>
					<p className='text-sm text-muted'>
						Select up to 3 genre tags for your music
					</p>
					<ErrorMessage errors={state?.errors?.genres} />
				</div>
				<TrackPublishToggle
					defaultChecked={initialData?.published}
					label='Artist'
				/>
			</div>
		</form>
	);
}
