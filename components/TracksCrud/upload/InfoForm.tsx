'use client';

import ErrorMessage from '@/components/ErrorMessage';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useFormState } from 'react-dom';
import TrackNavUpload from './TrackNav';
import { addTrackTextInfo } from '@/actions/upload-track/text-info';
import { Textarea } from '@/components/ui/textarea';
import { AlertUploadTrack } from './BasicsForm';
import { TrackWithgenres } from '@/db/tracks';

const CREDITS = 3000;

export default function TrackInfoForm({
	id,
	initialData,
}: {
	id: string;
	initialData: TrackWithgenres;
}) {
	const initialState = { message: null, errors: {} };
	const [state, action] = useFormState(
		addTrackTextInfo.bind(null, id),
		initialState
	);

	return (
		<form action={action} className='mt-4 sm:mt-8 grid sm:gap-3'>
			<TrackNavUpload step={2} id={id} />
			<AlertUploadTrack />
			<div className='lg:w-2/3 mt-2 grid gap-4 max-w-screen-sm'>
				<ErrorMessage errors={state?.message ? [state?.message] : undefined} />
				<div className='grid gap-2'>
					<Label
						htmlFor='trackInfo'
						className={cn(state?.errors?.trackInfo ? 'text-destructive' : '')}
					>
						Track Info *
					</Label>
					<Textarea
						className={cn(
							'max-w-lg min-h-96',
							state?.errors?.trackInfo
								? 'border-destructive focus-visible:ring-destructive '
								: ''
						)}
						name='trackInfo'
						defaultValue={initialData.info || undefined}
						maxLength={3000}
						id='trackInfo'
						required
					/>
					<p className='text-muted text-sm max-w-lg'>
						Give your listeners an introduction to the track
						<br />
						(Max. 3000 characters)
					</p>

					<ErrorMessage errors={state?.errors?.trackInfo} />
				</div>

				<div className='grid gap-2'>
					<Label
						htmlFor='more'
						className={cn(state?.errors?.more ? 'text-destructive' : '')}
					>
						Credits *
					</Label>
					<Textarea
						className={cn(
							'max-w-lg min-h-64',
							state?.errors?.more
								? 'border-destructive focus-visible:ring-destructive '
								: ''
						)}
						maxLength={CREDITS}
						name='more'
						defaultValue={initialData.credits || undefined}
						id='more'
						required
					/>

					<p className='text-muted text-sm max-w-lg'>
						Add additional information such as credits or mentions <br />
						(Max. {CREDITS} characters)
					</p>

					<ErrorMessage errors={state?.errors?.more} />
				</div>

				<div className='grid gap-2'>
					<Label
						htmlFor='articleLink'
						className={cn(state?.errors?.articleLink ? 'text-destructive' : '')}
					>
						Article Link
					</Label>
					<Input
						type='text'
						name='articleLink'
						id='articleLink'
						defaultValue={initialData.articleLink || undefined}
						placeholder='http://'
						className={cn(
							'max-w-lg',
							state?.errors?.articleLink
								? 'border-destructive focus-visible:ring-destructive'
								: ''
						)}
					/>
					<p className='text-muted text-sm max-w-lg'>
						Add a link to a Sounding Future article
					</p>
					<ErrorMessage errors={state?.errors?.articleLink} />
				</div>
			</div>
		</form>
	);
}
