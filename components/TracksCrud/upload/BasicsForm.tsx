'use client';

import {
	submitTrack,
	TrackFormState,
	updateTrack,
} from '@/actions/upload-track/basics';
import ErrorMessage from '@/components/ErrorMessage';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useFormState } from 'react-dom';
import { MultiSelect } from '@/components/ui/multi-select';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import TrackNavUpload from './TrackNav';
import { SelectInput } from '@/components/ui/select-input';
import ImageUpload from '@/components/profile/ImageUpload';

import ReleaseSelector from './ReleaseSelector';
import { YearSelect } from '@/components/YearSelect';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Artist, Genre, Partner, SourceFormat } from '@prisma/client';
import { TrackWithgenres } from '@/db/tracks';
import TrackRegistration from './TrackRegistration';

export default function TrackBasicsForm({
	role,
	sourceFormatData,
	artistsData,
	genresData,
	partnersData,
	initialData,
}: {
	initialData?: TrackWithgenres;
	role: string;
	sourceFormatData: SourceFormat[];
	partnersData: Partner[];
	artistsData: Artist[];
	genresData: Genre[];
}) {
	const initialState: TrackFormState = {
		message: null,
		errors: {},
		prev: {
			image: initialData?.cover,
			genres: initialData?.genres.map((g) => g.id),
		},
	};
	const [state, action] = useFormState(
		initialData?.id ? updateTrack.bind(null, initialData?.id) : submitTrack,
		initialState
	);

	return (
		<form action={action} className='mt-4 sm:mt-8 grid sm:gap-3'>
			<TrackNavUpload id={initialData?.id} />
			<AlertUploadTrack />

			<div className='lg:w-2/3 mt-2 grid gap-4 max-w-screen-sm'>
				<ErrorMessage errors={state?.message ? [state?.message] : undefined} />
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
						defaultValue={initialData?.title}
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
							className={cn(state?.errors?.artists ? 'text-destructive' : '')}
						>
							Artists *
						</Label>

						<MultiSelect
							options={artistsData.map((g) => ({ label: g.name, value: g.id }))}
							initialValue={initialData?.artists?.map((g) => g.artistId)}
							name='artists'
							placeholder='Select Artists'
							searchPlaceholder='Search Artists...'
							emptyMessage='No Artist found.'
							classNameMaxWidth={'w-full'}
							className={cn(
								state?.errors?.artists
									? 'border-destructive focus-visible:ring-destructive '
									: ''
							)}
							required
						/>

						<ErrorMessage errors={state?.errors?.artists} />
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
						initialValue={
							initialData?.releaseYear
								? initialData?.releaseYear.toString()
								: undefined
						}
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
							initialValue={initialData?.curatedBy || undefined}
							name='curatedBy'
							options={partnersData.map((c) => ({
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
							allowClear
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
						options={genresData.map((g) => ({ label: g.name, value: g.id }))}
						initialValue={initialData?.genres?.map((g) => g.id)}
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
					initialData={initialData?.cover}
					type='square'
					message='Upload a cover photo for your track (jpeg, min. 1000x1000px)'
					size='xl'
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
							value: s.id,
						}))}
						initialValue={initialData?.formatId || undefined}
						name='sourceFormat'
						placeholder='Select format'
						className={cn(
							state?.errors?.sourceFormat
								? 'border-destructive focus-visible:ring-destructive '
								: ''
						)}
						other
					/>

					<p className='text-muted text-sm '>
						Select fromat from list: AmbiX, 5.1, Stereo, ...
					</p>

					<ErrorMessage errors={state?.errors?.sourceFormat} />
				</div>

				<ReleaseSelector
					errors={state?.errors?.release}
					initialValue={initialData?.releasedBy || undefined}
				/>

				<TrackRegistration
					errors={state?.errors?.trackRegistration}
					initialValue={initialData?.trackRegistration || undefined}
				/>

				<div className='grid gap-2'>
					<Label
						htmlFor='isrcCode'
						className={cn(state?.errors?.isrcCode ? 'text-destructive' : '')}
					>
						ISRC Code (optional)
					</Label>
					<Input
						type='text'
						name='isrcCode'
						id='isrcCode'
						defaultValue={initialData?.isrcCode || undefined}
						className={cn(
							state?.errors?.isrcCode
								? 'border-destructive focus-visible:ring-destructive '
								: ''
						)}
					/>

					<p className='text-muted text-sm '>
						Enter the ISRC (International Standard Recording Code)
					</p>

					<ErrorMessage errors={state?.errors?.isrcCode} />
				</div>

				<LegalAgreementSection />
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
