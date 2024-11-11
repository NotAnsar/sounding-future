'use client';

import { submitTrack } from '@/actions/upload-track/basics';
import ErrorMessage from '@/components/ErrorMessage';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useFormState } from 'react-dom';
import { MultiSelect } from '@/components/ui/multi-select';
import { artists, collections, genres } from '@/config/dummy-data';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import TrackNavUpload from '@/components/upload-track/TrackNav';
import { SelectInput } from '@/components/ui/select-input';
import ImageUpload from '@/components/profile/ImageUpload';
import { sourceFormatData } from '@/config/tags';
import ReleaseSelector from './ReleaseSelector';
import { YearSelect } from '@/components/YearSelect';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function TrackBasicsForm({ role }: { role: string }) {
	const initialState = { message: null, errors: {} };
	const [state, action] = useFormState(submitTrack, initialState);

	return (
		<form action={action} className='mt-4 sm:mt-8 grid sm:gap-3'>
			<TrackNavUpload />
			<AlertUploadTrack />

			<div className='lg:w-2/3 mt-2 grid gap-4 max-w-screen-sm'>
				<ErrorMessage errors={state?.message ? [state.message] : undefined} />
				<div className='grid gap-2'>
					<Label
						htmlFor='trackName'
						className={cn(state?.errors?.trackName ? 'text-destructive' : '')}
					>
						Track name *
					</Label>
					<Input
						type='text'
						name='trackName'
						id='trackName'
						className={cn(
							state?.errors?.trackName
								? 'border-destructive focus-visible:ring-destructive '
								: ''
						)}
						required
					/>

					<ErrorMessage errors={state?.errors?.trackName} />
				</div>

				{role === 'admin' ? (
					<div className='grid gap-2'>
						<Label
							htmlFor='artist'
							className={cn(state?.errors?.artist ? 'text-destructive' : '')}
						>
							Artist *
						</Label>

						<SelectInput
							name='artist'
							options={artists.map((a) => ({ label: a.name, value: a.id }))}
							placeholder='Select Artist'
							searchPlaceholder='Search Artist...'
							emptyMessage='No Artist found.'
							className={cn(
								state?.errors?.artist
									? 'border-destructive focus-visible:ring-destructive '
									: ''
							)}
						/>

						<ErrorMessage errors={state?.errors?.artist} />
					</div>
				) : null}

				<div className='grid gap-2'>
					<Label
						htmlFor='releaseYear'
						className={cn(state?.errors?.releaseYear ? 'text-destructive' : '')}
					>
						Release Year *
					</Label>

					<YearSelect
						className={cn(
							state?.errors?.releaseYear
								? 'border-destructive focus-visible:ring-destructive '
								: ''
						)}
						name='releaseYear'
					/>

					<ErrorMessage errors={state?.errors?.releaseYear} />
				</div>

				{role === 'admin' ? (
					<div className='grid gap-2'>
						<Label
							htmlFor='curatedBy'
							className={cn(state?.errors?.curatedBy ? 'text-destructive' : '')}
						>
							Curated by
						</Label>
						<SelectInput
							name='curatedBy'
							options={collections.map((c) => ({
								label: c.name,
								value: c.id,
							}))}
							placeholder='Select Partner'
							searchPlaceholder='Search partner...'
							emptyMessage='No partner found.'
							className={cn(
								state?.errors?.curatedBy
									? 'border-destructive focus-visible:ring-destructive '
									: ''
							)}
						/>

						<p className='text-muted text-sm '>
							Indicates whether the track is part of a curated collection.
							<br />
							(Field will be filled in by admin.)
						</p>

						<ErrorMessage errors={state?.errors?.curatedBy} />
					</div>
				) : null}

				<div className='grid gap-2'>
					<Label
						className={cn(state?.errors?.genreTags ? 'text-destructive' : '')}
						htmlFor={'genreTags'}
					>
						Track genre tags *
					</Label>
					<MultiSelect
						options={genres.map((g) => ({ label: g.name, value: g.id }))}
						name='genreTags'
						placeholder='Select genre tags'
						searchPlaceholder='Search genre tags...'
						emptyMessage='No genre tag found.'
						classNameMaxWidth={'w-full'}
						className={cn(
							state?.errors?.genreTags
								? 'border-destructive focus-visible:ring-destructive '
								: ''
						)}
						required
					/>
					<p className='text-sm text-muted'>Select 3 genre tags from list</p>
					<ErrorMessage errors={state?.errors?.genreTags} />
				</div>

				<ImageUpload
					name='imageFile'
					error={state?.errors?.imageFile}
					type='square'
					message='Upload a cover photo for your track (jpeg, min. 1000x1000px)'
					size='lg'
					label='Track Cover *'
				/>

				<div className='grid gap-2'>
					<Label
						htmlFor='sourceFormat'
						className={cn(
							state?.errors?.sourceFormat ? 'text-destructive' : ''
						)}
					>
						Source Format *
					</Label>

					<SelectInput
						options={sourceFormatData.map((s) => ({
							label: s.name,
							value: s.name,
						}))}
						name='sourceFormat'
						placeholder='Select format'
						className={cn(
							state?.errors?.sourceFormat
								? 'border-destructive focus-visible:ring-destructive '
								: ''
						)}
					/>

					<p className='text-muted text-sm '>
						Select fromat from list: AmbiX, 5.1, Stereo, ...
					</p>

					<ErrorMessage errors={state?.errors?.sourceFormat} />
				</div>

				<ReleaseSelector errors={state?.errors?.release} />
				<LegalAgreementSection />
				{/* <div>
					<div className='border rounded-lg p-4 space-y-2'>
						<div className='flex items-start space-x-2 relative'>
							<Checkbox id='legal-agreement' name='legal-agreement' required />
							<div className='space-y-1 leading-none'>
								<label
									htmlFor='legal-agreement'
									className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
								>
									By adding my audio track and press SAVE, I agree to the legal
									terms and conditions of publishing my audio track in the
									Sounding Future AudioSpace.
								</label>
							</div>
						</div>

						<div className='space-y-2'>
							<p className='text-sm text-muted-foreground'>
								Learn more about our legal platform terms and conditions:
							</p>
							<Button variant='outline' asChild className='w-full'>
								<Link href='/legal' target='_blank'>
									Legal Terms
								</Link>
							</Button>
						</div>
					</div>
				</div> */}
			</div>
		</form>
	);
}

export function AlertUploadTrack() {
	return (
		<Alert className='border-transparent bg-secondary mt-3'>
			<AlertDescription>
				{
					"We're glad you want to add an audio track to our AudioSpace! In steps 1 and 2, you can enter your track's metadata (title information, text, credits, etc.). In step 3, you can upload the audio using our high-speed upload service."
				}
			</AlertDescription>
			<AlertDescription className='mt-2 '>
				All fields marked with * are mandatory.
			</AlertDescription>
		</Alert>
	);
}

const LegalAgreementSection = () => {
	return (
		<div className='border rounded-lg p-4 bg-card text-white'>
			<div className='flex items-start gap-3'>
				<Checkbox
					id='legal-agreement'
					name='legal-agreement'
					required
					className='mt-1'
				/>
				<div className='space-y-2'>
					<label htmlFor='legal-agreement' className='text-sm font-medium '>
						By adding my audio track and press SAVE, I agree to the legal terms
						and conditions of publishing my audio track in the Sounding Future
						AudioSpace.
					</label>
					<p className='text-xs text-muted'>
						By checking this box and saving, you acknowledge that you have read
						and agree to our{' '}
						<Link
							href='/legal'
							target='_blank'
							rel='noopener noreferrer'
							className='text-primary hover:underline font-semibold'
						>
							legal terms and conditions
						</Link>{' '}
						for audio track publication.
					</p>
				</div>
			</div>
		</div>
	);
};
