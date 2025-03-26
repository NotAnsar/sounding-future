'use client';

import ErrorMessage from '@/components/ErrorMessage';
import ImageUpload from '@/components/profile/ImageUpload';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import { Textarea } from '@/components/ui/textarea';
import { ArtistDetailsStats } from '@/db/artist';
import { cn } from '@/lib/utils';
import { Genre } from '@prisma/client';
import { useFormState } from 'react-dom';
import ArtistNav from './ArtistNav';
import {
	ArtistFormState,
	createArtist,
	updateArtist,
} from '@/actions/artists/artist-info';
import { PublishToggle } from '@/components/PublishToggle';

const MaxChar = 1500;

export default function ArtistForm({
	initialData,
	genres,
}: {
	initialData?: ArtistDetailsStats;
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
				<div className='grid gap-x-4 gap-y-2 sm:grid-cols-2 max-w-lg'>
					<div className='grid gap-2'>
						<Label
							htmlFor='f_name'
							className={cn(state?.errors?.f_name ? 'text-destructive' : '')}
						>
							First name
						</Label>
						<Input
							type='text'
							name='f_name'
							id='f_name'
							defaultValue={
								initialData?.f_name || initialData?.user?.f_name || undefined
							}
							className={cn(
								state?.errors?.f_name
									? 'border-destructive focus-visible:ring-destructive '
									: ''
							)}
						/>

						<ErrorMessage errors={state?.errors?.f_name} />
					</div>
					<div className='grid gap-2'>
						<Label
							htmlFor='l_name'
							className={cn(state?.errors?.l_name ? 'text-destructive' : '')}
						>
							Last name
						</Label>
						<Input
							type='text'
							name='l_name'
							id='l_name'
							defaultValue={
								initialData?.l_name || initialData?.user?.l_name || undefined
							}
							className={cn(
								state?.errors?.l_name
									? 'border-destructive focus-visible:ring-destructive '
									: ''
							)}
						/>

						<ErrorMessage errors={state?.errors?.l_name} />
					</div>
					<p className='text-muted text-sm max-w-lg col-span-full'>
						For legal reasons, creators who add an artist profile and showcase
						music on Sounding Future must provide their first and last name
						(this information will not be displayed publicly).
					</p>
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
				<PublishToggle defaultChecked={initialData?.published} label='Artist' />
			</div>
		</form>
	);
}
