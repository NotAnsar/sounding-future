// import React from 'react';
// import { Label } from '@/components/ui/label';
// import { Input } from '@/components/ui/input';
// import { Music2 } from 'lucide-react';
// import { cn } from '@/lib/utils';
// import ErrorMessage from '../../ErrorMessage';
// import { PublishToggle } from '../../PublishToggle';
// import { TrackWithgenres } from '@/db/tracks';

// interface TrackUploadProps {
// 	errors?: {
// 		variant1?: string[];
// 		variant2?: string[];
// 		variant3?: string[];
// 		published?: string[];
// 	};
// 	initialData: TrackWithgenres;
// }

// export default function TrackUploadSection({
// 	errors,
// 	initialData,
// }: TrackUploadProps) {
// 	return (
// 		<>
// 			<div className='grid gap-6'>
// 				<h2 className='text-xl font-bold'>Converted tracks</h2>
// 				<div className='grid gap-2'>
// 					<Label
// 						htmlFor='variant1'
// 						className={cn(errors?.variant1 ? 'text-destructive' : '')}
// 					>
// 						Upload Track
// 					</Label>

// 					<div className='grid gap-6'>
// 						<UploadInput
// 							message='track - variant 1 - binaural'
// 							name='variant1'
// 							errors={errors?.variant1}
// 							url={initialData.variant1 || undefined}
// 						/>
// 						<UploadInput
// 							message='track - variant 2 - binaural+'
// 							name='variant2'
// 							errors={errors?.variant2}
// 							url={initialData.variant2 || undefined}
// 						/>
// 						<UploadInput
// 							message='track - variant 3 - stereo'
// 							name='variant3'
// 							errors={errors?.variant3}
// 							url={initialData.variant3 || undefined}
// 						/>
// 					</div>
// 				</div>
// 			</div>
// 			<PublishToggle defaultChecked={initialData.published} />
// 		</>
// 	);
// }

// function UploadInput({
// 	name,
// 	errors,
// 	message,
// 	accept = '.mp3,audio/mpeg,.wav,audio/wav,.webm,audio/webm',
// 	url,
// }: {
// 	name: string;
// 	errors?: string[];
// 	message: string;
// 	accept?: string;
// 	url?: string;
// }) {
// 	return (
// 		<div className='grid gap-2'>
// 			<div className='relative max-w-lg cursor-pointer'>
// 				<Input
// 					type='file'
// 					name={name}
// 					id={name}
// 					accept={accept}
// 					className={cn(
// 						'cursor-pointer h-9 file:h-full file:border-0',
// 						'file:bg-transparent file:cursor-pointer',
// 						'flex items-center justify-between',
// 						errors ? 'border-destructive focus-visible:ring-destructive' : ''
// 					)}
// 				/>
// 				<Music2 className='absolute right-3 top-1/2 transform -translate-y-1/2 text-muted w-4 h-auto aspect-square' />
// 			</div>

// 			{url && (
// 				<p className='text-[13px] text-muted'>{url.split('/').pop() || url}</p>
// 			)}

// 			{url && (
// 				<audio controls className='w-full max-w-lg h-10 rounded-md '>
// 					<source src={url} type='audio/mpeg' />
// 					Your browser does not support the audio element.
// 				</audio>
// 			)}

// 			<p className='text-muted text-sm max-w-lg'>{message}</p>

// 			<ErrorMessage errors={errors} />
// 		</div>
// 	);
// }

import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Loader, Music2, Trash } from 'lucide-react';
import { cn } from '@/lib/utils';
import ErrorMessage from '../../ErrorMessage';
import { PublishToggle } from '../../PublishToggle';
import { TrackWithgenres } from '@/db/tracks';
import { deleteTrackVariant } from '@/actions/upload-track/audio-file';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

interface TrackUploadProps {
	errors?: {
		variant1?: string[];
		variant2?: string[];
		variant3?: string[];
		published?: string[];
	};
	initialData: TrackWithgenres;
	trackId: string;
}

export default function TrackUploadSection({
	errors,
	initialData,
	trackId,
}: TrackUploadProps) {
	return (
		<>
			<div className='grid gap-6'>
				<h2 className='text-xl font-bold'>Converted tracks</h2>
				<div className='grid gap-2'>
					<Label
						htmlFor='variant1'
						className={cn(errors?.variant1 ? 'text-destructive' : '')}
					>
						Upload Track
					</Label>

					<div className='grid gap-6'>
						<UploadInput
							message='track - variant 1 - binaural'
							name='variant1'
							errors={errors?.variant1}
							url={initialData.variant1 || undefined}
							trackId={trackId}
						/>
						<UploadInput
							message='track - variant 2 - binaural+'
							name='variant2'
							errors={errors?.variant2}
							url={initialData.variant2 || undefined}
							trackId={trackId}
						/>
						<UploadInput
							message='track - variant 3 - stereo'
							name='variant3'
							errors={errors?.variant3}
							url={initialData.variant3 || undefined}
							trackId={trackId}
						/>
					</div>
				</div>
			</div>
			<PublishToggle
				defaultChecked={initialData.published}
				key={initialData.published ? 'published' : 'unpublished'}
			/>
		</>
	);
}

function UploadInput({
	name,
	errors,
	message,
	accept = '.mp3,audio/mpeg,.wav,audio/wav,.webm,audio/webm',
	url,
	trackId,
}: {
	name: string;
	errors?: string[];
	message: string;
	accept?: string;
	url?: string;
	trackId: string;
}) {
	const [isPending, startTransition] = React.useTransition();

	const handleDelete = (e: React.FormEvent<HTMLButtonElement>) => {
		e.preventDefault();
		startTransition(async () => {
			const formData = new FormData();
			formData.set('trackId', trackId);
			formData.set('variant', name);
			const { success } = await deleteTrackVariant(formData);

			toast({
				title: success ? 'Track deleted' : 'Failed to delete track',
				variant: success ? 'default' : 'destructive',
			});
		});
	};

	return (
		<div className='grid gap-2'>
			<div className='relative max-w-lg cursor-pointer'>
				<Input
					type='file'
					name={name}
					id={name}
					accept={accept}
					className={cn(
						'cursor-pointer h-9 file:h-full file:border-0',
						'file:bg-transparent file:cursor-pointer',
						'flex items-center justify-between',
						errors ? 'border-destructive focus-visible:ring-destructive' : ''
					)}
				/>
				<Music2 className='absolute right-3 top-1/2 transform -translate-y-1/2 text-muted w-4 h-auto aspect-square' />
			</div>

			{url && (
				<p className='text-[13px] text-muted'>{url.split('/').pop() || url}</p>
			)}

			{url && (
				<div className='flex items-center gap-4'>
					<audio controls className='w-full max-w-lg h-10 rounded-md '>
						<source src={url} type='audio/mpeg' />
						Your browser does not support the audio element.
					</audio>
					<Button
						onClick={handleDelete}
						disabled={isPending}
						variant={'destructive'}
					>
						{isPending ? (
							<Loader className=' h-4 w-4 animate-spin text-white' />
						) : (
							<Trash className='w-4 h-auto aspect-square' />
						)}
					</Button>
				</div>
			)}

			<p className='text-muted text-sm max-w-lg'>{message}</p>

			<ErrorMessage errors={errors} />
		</div>
	);
}
