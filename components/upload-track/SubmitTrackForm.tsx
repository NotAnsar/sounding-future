// 'use client';

// import { submitTrack } from '@/actions/upload-track/basics';
// import ErrorMessage from '@/components/ErrorMessage';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Tabs, TabsContent } from '@/components/ui/tabs';
// import UploadTrackNav from '@/components/upload-track/UploadTrackNav';
// import { toast } from '@/hooks/use-toast';
// import { cn } from '@/lib/utils';
// import { useRouter } from 'next/navigation';
// import { useEffect } from 'react';
// import { useFormState } from 'react-dom';
// import { DatePickerInput } from '@/components/ui/datepickerInput';
// import { MultiSelect } from '@/components/ui/multi-select';
// import { artists, collections, genres } from '@/config/dummy-data';
// import { Checkbox } from '../ui/checkbox';
// import { Button } from '../ui/button';
// import Link from 'next/link';

// export default function SubmitTrackForm({ role }: { role: string }) {
export default function SubmitTrackForm() {
	return <h1>ldslùlm</h1>;
	// const initialState = { message: null, errors: {} };
	// const [state, action] = useFormState(submitTrack, initialState);
	// const router = useRouter();
	// useEffect(() => {
	// 	if (state.message === 'Track submitted successfully') {
	// 		// router.push('/');
	// 		toast({ description: 'Track submitted successfully', title: 'Success' });
	// 	}
	// }, [state, router]);
	// return (
	// 	<form action={action}>
	// 		<Tabs value={'basics'} className='mt-4 sm:mt-8 grid sm:gap-3'>
	// 			<UploadTrackNav isAdmin={role === 'admin'} />
	// 			<TabsContent value='basics' className='lg:w-2/3 mt-2 grid gap-3'>
	// 				<ErrorMessage errors={state.message ? [state.message] : undefined} />
	// 				<div className='grid gap-2'>
	// 					<Label
	// 						htmlFor='trackName'
	// 						className={cn(state?.errors?.trackName ? 'text-destructive' : '')}
	// 					>
	// 						Track name
	// 					</Label>
	// 					<Input
	// 						type='text'
	// 						name='trackName'
	// 						id='trackName'
	// 						className={cn(
	// 							'max-w-lg',
	// 							state?.errors?.trackName
	// 								? 'border-destructive focus-visible:ring-destructive '
	// 								: ''
	// 						)}
	// 					/>
	// 					<ErrorMessage errors={state?.errors?.trackName} />
	// 				</div>
	// 				{role === 'admin' ? (
	// 					<div className='grid gap-2'>
	// 						<Label
	// 							htmlFor='artist'
	// 							className={cn(state?.errors?.artist ? 'text-destructive' : '')}
	// 						>
	// 							Artist
	// 						</Label>
	// 						<MultiSelect
	// 							name='artist'
	// 							options={artists.map((a) => ({ label: a.name, value: a.id }))}
	// 							placeholder='Select Artist'
	// 							searchPlaceholder='Search Artist...'
	// 							emptyMessage='No Artist found.'
	// 							className={cn(
	// 								'max-w-lg',
	// 								state?.errors?.artist
	// 									? 'border-destructive focus-visible:ring-destructive '
	// 									: ''
	// 							)}
	// 						/>
	// 						<p className='text-muted text-sm max-w-lg'>
	// 							select one or more from list
	// 						</p>
	// 						<ErrorMessage errors={state?.errors?.artist} />
	// 					</div>
	// 				) : null}
	// 				<div className='grid gap-2'>
	// 					<Label
	// 						htmlFor='releaseYear'
	// 						className={cn(
	// 							state?.errors?.releaseYear ? 'text-destructive' : ''
	// 						)}
	// 					>
	// 						Release Year
	// 					</Label>
	// 					<DatePickerInput
	// 						name='releaseYear'
	// 						className={cn(
	// 							'max-w-lg',
	// 							state?.errors?.releaseYear
	// 								? 'border-destructive focus-visible:ring-destructive '
	// 								: ''
	// 						)}
	// 					/>
	// 					<ErrorMessage errors={state?.errors?.releaseYear} />
	// 				</div>
	// 				<div className='grid gap-2'>
	// 					<Label
	// 						htmlFor='recognitions'
	// 						className={cn(
	// 							state?.errors?.recognitions ? 'text-destructive' : ''
	// 						)}
	// 					>
	// 						Recognitions
	// 					</Label>
	// 					<MultiSelect
	// 						name='recognitions'
	// 						options={[
	// 							{ label: 'Recognitions 1', value: 'Recognitions 1' },
	// 							{ label: 'Recognitions 2', value: 'Recognitions 2' },
	// 							{ label: 'Recognitions 3', value: 'Recognitions 3' },
	// 						]}
	// 						placeholder='Select Recognitions'
	// 						searchPlaceholder='Search Recognitions...'
	// 						emptyMessage='No Recognitions found.'
	// 						className={cn(
	// 							'max-w-lg',
	// 							state?.errors?.recognitions
	// 								? 'border-destructive focus-visible:ring-destructive '
	// 								: ''
	// 						)}
	// 					/>
	// 					<p className='text-muted text-sm max-w-lg'>
	// 						select one or more from list
	// 					</p>
	// 					<ErrorMessage errors={state?.errors?.recognitions} />
	// 				</div>
	// 				{role === 'admin' ? (
	// 					<div className='grid gap-2'>
	// 						<Label
	// 							htmlFor='curatedBy'
	// 							className={cn(
	// 								state?.errors?.curatedBy ? 'text-destructive' : ''
	// 							)}
	// 						>
	// 							Curated by
	// 						</Label>
	// 						<MultiSelect
	// 							name='curatedBy'
	// 							options={collections.map((c) => ({
	// 								label: c.name,
	// 								value: c.id,
	// 							}))}
	// 							placeholder='Select items'
	// 							searchPlaceholder='Search items...'
	// 							emptyMessage='No items found.'
	// 							className={cn(
	// 								'max-w-lg',
	// 								state?.errors?.curatedBy
	// 									? 'border-destructive focus-visible:ring-destructive '
	// 									: ''
	// 							)}
	// 						/>
	// 						<p className='text-muted text-sm max-w-lg'>
	// 							select one or more curator
	// 						</p>
	// 						<ErrorMessage errors={state?.errors?.curatedBy} />
	// 					</div>
	// 				) : null}
	// 				<div className='grid gap-2'>
	// 					<Label
	// 						className={cn(state?.errors?.genreTags ? 'text-destructive' : '')}
	// 						htmlFor={'genreTags'}
	// 					>
	// 						Track genre tags
	// 					</Label>
	// 					<MultiSelect
	// 						options={genres.map((g) => ({ label: g.name, value: g.id }))}
	// 						name='genreTags'
	// 						placeholder='Select genre tags'
	// 						searchPlaceholder='Search genre tags...'
	// 						emptyMessage='No genre tag found.'
	// 						className={cn(
	// 							'max-w-lg',
	// 							state?.errors?.genreTags
	// 								? 'border-destructive focus-visible:ring-destructive '
	// 								: ''
	// 						)}
	// 					/>
	// 					<p className='text-sm text-muted'>Select 3 genre tags from list</p>
	// 					<ErrorMessage errors={state?.errors?.genreTags} />
	// 				</div>
	// 				<div className='max-w-lg '>
	// 					<div className='border rounded-lg p-4 space-y-2'>
	// 						<div className='flex items-start space-x-2 relative'>
	// 							<Checkbox
	// 								id='legal-agreement'
	// 								name='legal-agreement'
	// 								required
	// 							/>
	// 							<div className='space-y-1 leading-none'>
	// 								<label
	// 									htmlFor='legal-agreement'
	// 									className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
	// 								>
	// 									By adding my audio track and press SAVE, I agree to the
	// 									legal terms and conditions of publishing my audio track in
	// 									the Sounding Future 3Daudiospace.
	// 								</label>
	// 							</div>
	// 						</div>
	// 						<div className='space-y-2'>
	// 							<p className='text-sm text-muted-foreground'>
	// 								Learn more about our legal platform terms and conditions:
	// 							</p>
	// 							<Button variant='outline' asChild className='w-full'>
	// 								<Link href='/legal' target='_blank'>
	// 									Legal Terms
	// 								</Link>
	// 							</Button>
	// 						</div>
	// 					</div>
	// 				</div>
	// 			</TabsContent>
	// 		</Tabs>
	// 	</form>
	// );
}
