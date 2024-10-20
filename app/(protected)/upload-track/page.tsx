'use client';

import { submitTrack } from '@/actions/upload-track/basics';
import ErrorMessage from '@/components/ErrorMessage';
import GenreSelector from '@/components/profile/GenreSelector';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import UploadTrackNav from '@/components/upload-track/UploadTrackNav';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useFormState } from 'react-dom';
import { AVAILABLE_GENRES } from '../profile/page';
import { DatePickerInput } from '@/components/ui/datepickerInput';
import { MultiSelect } from '@/components/ui/multi-select';
import { artists, collections } from '@/config/dummy-data';

export default function Page() {
	const initialState = { message: null, errors: {} };
	const [state, action] = useFormState(submitTrack, initialState);
	const router = useRouter();

	useEffect(() => {
		if (state.message === 'Account updated successfully') {
			router.push('/');
			toast({ description: 'Account updated successfully', title: 'Success' });
		}
	}, [state, router]);

	return (
		<form action={action}>
			<Tabs value={'basics'} className='mt-4 sm:mt-8 grid sm:gap-3'>
				<UploadTrackNav />
				<TabsContent value='basics' className='lg:w-2/3 mt-2 grid gap-3'>
					<ErrorMessage errors={state.message ? [state.message] : undefined} />
					<div className='grid gap-2'>
						<Label
							htmlFor='trackName'
							className={cn(state?.errors?.trackName ? 'text-destructive' : '')}
						>
							Track name
						</Label>
						<Input
							type='text'
							name='trackName'
							id='trackName'
							className={cn(
								'max-w-lg',
								state?.errors?.trackName
									? 'border-destructive focus-visible:ring-destructive '
									: ''
							)}
						/>

						<ErrorMessage errors={state?.errors?.trackName} />
					</div>

					<div className='grid gap-2'>
						<Label
							htmlFor='artist'
							className={cn(state?.errors?.artist ? 'text-destructive' : '')}
						>
							Artist
						</Label>
						<MultiSelect
							name='artist'
							options={artists.map((a) => ({ label: a.name, value: a.id }))}
							placeholder='Select Artist'
							searchPlaceholder='Search Artist...'
							emptyMessage='No Artist found.'
							className='max-w-lg '
						/>
						<p className='text-muted text-sm'>select one or more from list</p>

						<ErrorMessage errors={state?.errors?.artist} />
					</div>

					<div className='grid gap-2'>
						<Label
							htmlFor='releaseYear'
							className={cn(
								state?.errors?.releaseYear ? 'text-destructive' : ''
							)}
						>
							Release Year
						</Label>

						<DatePickerInput
							name='releaseYear'
							className={cn(
								'max-w-lg',
								state?.errors?.releaseYear
									? 'border-destructive focus-visible:ring-destructive '
									: ''
							)}
						/>

						<ErrorMessage errors={state?.errors?.releaseYear} />
					</div>

					<div className='grid gap-2'>
						<Label
							htmlFor='recognitions'
							className={cn(
								state?.errors?.recognitions ? 'text-destructive' : ''
							)}
						>
							Recognitions
						</Label>
						<MultiSelect
							name='recognitions'
							options={[
								{ label: 'Recognitions 1', value: 'Recognitions 1' },
								{ label: 'Recognitions 2', value: 'Recognitions 2' },
								{ label: 'Recognitions 3', value: 'Recognitions 3' },
							]}
							placeholder='Select Recognitions'
							searchPlaceholder='Search Recognitions...'
							emptyMessage='No Recognitions found.'
							className='max-w-lg'
						/>

						<p className='text-muted text-sm'>select one or more from list</p>

						<ErrorMessage errors={state?.errors?.recognitions} />
					</div>

					<div className='grid gap-2'>
						<Label
							htmlFor='curatedBy'
							className={cn(state?.errors?.curatedBy ? 'text-destructive' : '')}
						>
							Curated by
						</Label>
						<MultiSelect
							name='curatedBy'
							options={collections.map((c) => ({ label: c.name, value: c.id }))}
							placeholder='Select items'
							searchPlaceholder='Search items...'
							emptyMessage='No items found.'
							className='max-w-lg'
						/>

						<p className='text-muted text-sm'>select one or more curator</p>

						<ErrorMessage errors={state?.errors?.curatedBy} />
					</div>

					<GenreSelector
						genres={AVAILABLE_GENRES}
						initialGenres={[]}
						error={state?.errors?.genreTags}
						name='genreTags'
						message='Select 3 genre tags from list'
						label='Track genre tags'
					/>
				</TabsContent>
			</Tabs>
		</form>
	);
}
