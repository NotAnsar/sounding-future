'use client';

import { useFormState } from 'react-dom';
import ErrorMessage from '@/components/ErrorMessage';
import SaveButton from '@/components/profile/SaveButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { HelpCenterVideo } from '@prisma/client';
import {
	createHelpCenterVideo,
	HelpCenterVideoState,
	updateHelpCenterVideo,
} from '@/actions/helpcenter-action';

import { PublishToggle } from '../PublishToggle';
import StudioVideoUpload from '../profile/VideoUpload';
import StudioImageUpload from '../profile/StudioImageUpload';
import HLSUploadSection from '../LMS/chapter/HLSUploadSection';

export default function HelpCenterForm({
	initialData,
}: {
	initialData?: HelpCenterVideo;
}) {
	const initialState: HelpCenterVideoState = {
		message: null,
		errors: {},
		prev: {
			videoUrl: initialData?.videoUrl || undefined,
			thumbnailUrl: initialData?.thumbnailUrl || undefined,
			hlsUrl: initialData?.hlsUrl || undefined,
		},
	};

	const [state, action] = useFormState(
		initialData?.id
			? updateHelpCenterVideo.bind(null, initialData?.id)
			: createHelpCenterVideo,
		initialState
	);

	return (
		<form action={action} className='mt-4 sm:mt-8 grid '>
			<div className='w-full flex justify-end'>
				<SaveButton />
			</div>
			<div className='grid gap-4 max-w-lg'>
				<ErrorMessage errors={state?.message ? [state?.message] : undefined} />

				<div className='grid gap-2'>
					<Label
						htmlFor='title'
						className={cn(state?.errors?.title ? 'text-destructive' : '')}
					>
						Title
					</Label>
					<Input
						type='text'
						name='title'
						id='title'
						defaultValue={initialData?.title || undefined}
						className={cn(
							'max-w-lg',
							state?.errors?.title
								? 'border-destructive focus-visible:ring-destructive '
								: ''
						)}
					/>

					<ErrorMessage errors={state?.errors?.title} />
				</div>

				<div className='grid gap-2'>
					<Label
						htmlFor='description'
						className={cn(state?.errors?.description ? 'text-destructive' : '')}
					>
						Description
					</Label>
					<Textarea
						className={cn(
							'max-w-lg min-h-80',
							state?.errors?.description
								? 'border-destructive focus-visible:ring-destructive '
								: ''
						)}
						defaultValue={initialData?.description || undefined}
						name='description'
						id='description'
					/>

					<ErrorMessage errors={state?.errors?.description} />
				</div>

				<StudioVideoUpload
					name='videoUrl'
					error={state?.errors?.videoUrl}
					label='Video'
					type='square'
					initialData={initialData?.videoUrl || undefined}
					message='Upload Video, max. 200mb'
				/>

				<HLSUploadSection
					errors={{ hlsUrl: state?.errors?.hlsUrl }}
					initialHlsUrl={initialData?.hlsUrl || undefined}
				/>

				<StudioImageUpload
					name='thumbnailUrl'
					error={state?.errors?.thumbnailUrl}
					label='Thumbnail Image'
					type='square'
					initialData={initialData?.thumbnailUrl || undefined}
					message='Upload Background image, max. 2mb'
				/>

				<PublishToggle
					defaultChecked={initialData?.published}
					label='Help Center Video '
					className='max-w-lg'
				/>
			</div>
		</form>
	);
}
