import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Music2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import ErrorMessage from '../../ErrorMessage';
import { TrackPublishToggle } from '../../TrackPublishToggle';
import { TrackWithgenres } from '@/db/tracks';

interface TrackUploadProps {
	errors?: {
		variant1?: string[];
		variant2?: string[];
		variant3?: string[];
		published?: string[];
	};
	initialData: TrackWithgenres;
}

export default function TrackUploadSection({
	errors,
	initialData,
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

					<div className='grid gap-4'>
						<UploadInput
							message='track - variant 1 - binaural'
							name='variant1'
							errors={errors?.variant1}
							url={initialData.variant1 || undefined}
						/>
						<UploadInput
							message='track - variant 2 - binaural+'
							name='variant2'
							errors={errors?.variant2}
							url={initialData.variant2 || undefined}
						/>
						<UploadInput
							message='track - variant 3 - stereo'
							name='variant3'
							errors={errors?.variant3}
							url={initialData.variant3 || undefined}
						/>
					</div>
				</div>
			</div>
			<TrackPublishToggle defaultChecked={initialData.published} />
		</>
	);
}

function UploadInput({
	name,
	errors,
	message,
	accept = '.mp3,audio/mpeg,.wav,audio/wav',
	url,
}: {
	name: string;
	errors?: string[];
	message: string;
	accept?: string;
	url?: string;
}) {
	return (
		<div className='grid gap-2'>
			{url && (
				<p className='text-[13px] text-[#FBFF00]'>
					{url.split('/').pop() || url}
				</p>
			)}
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
				<audio controls className='w-full max-w-lg h-10 rounded-md '>
					<source src={url} type='audio/mpeg' />
					Your browser does not support the audio element.
				</audio>
			)}

			<p className='text-muted text-sm max-w-lg'>{message}</p>

			<ErrorMessage errors={errors} />
		</div>
	);
}
