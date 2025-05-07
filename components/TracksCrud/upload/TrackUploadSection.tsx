import React, { useState } from 'react';
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

// Helper function to extract audio duration
const getAudioDuration = async (file: File): Promise<number> => {
	return new Promise((resolve) => {
		const audio = new Audio();
		audio.preload = 'metadata';

		audio.onloadedmetadata = () => {
			URL.revokeObjectURL(audio.src);
			resolve(Math.round(audio.duration));
		};

		// Fallback if metadata load fails
		audio.onerror = () => {
			console.error('Error loading audio metadata');
			URL.revokeObjectURL(audio.src);
			resolve(0);
		};

		audio.src = URL.createObjectURL(file);
	});
};

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
	const [duration, setDuration] = useState<number>(0);

	// Handle duration update from child components
	const handleDurationExtracted = (seconds: number) => {
		setDuration(seconds);
	};

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

					{/* Hidden input for duration */}
					<input type='hidden' name='duration' value={duration} />

					<div className='grid gap-6'>
						<UploadInput
							message='track - variant 1 - binaural'
							name='variant1'
							errors={errors?.variant1}
							url={initialData.variant1 || undefined}
							trackId={trackId}
							originalName={initialData.variant1Name || undefined}
							onDurationExtracted={handleDurationExtracted}
						/>
						<UploadInput
							message='track - variant 2 - binaural+'
							name='variant2'
							errors={errors?.variant2}
							url={initialData.variant2 || undefined}
							trackId={trackId}
							originalName={initialData.variant2Name || undefined}
							onDurationExtracted={handleDurationExtracted}
						/>
						<UploadInput
							message='track - variant 3 - stereo'
							name='variant3'
							errors={errors?.variant3}
							url={initialData.variant3 || undefined}
							trackId={trackId}
							originalName={initialData.variant3Name || undefined}
							onDurationExtracted={handleDurationExtracted}
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
	// accept = '.mp3,audio/mpeg,.wav,audio/wav,.webm,audio/webm',
	accept = '.mp3,audio/mpeg,.wav,audio/wav,.webm,audio/webm,.m4a,audio/mp4,audio/x-m4a,.opus,audio/opus,audio/ogg',
	url,
	trackId,
	originalName,
	onDurationExtracted,
}: {
	originalName?: string;
	name: string;
	errors?: string[];
	message: string;
	accept?: string;
	url?: string;
	trackId: string;
	onDurationExtracted?: (duration: number) => void;
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

	// Handle file change to extract duration
	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file || !onDurationExtracted) return;

		try {
			const duration = await getAudioDuration(file);
			onDurationExtracted(duration);
		} catch (error) {
			console.error('Failed to extract duration:', error);
		}
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
					onChange={handleFileChange}
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
							<Trash className='w-4 h-4 aspect-square' />
						)}
					</Button>
				</div>
			)}

			<p className='text-muted text-sm max-w-lg'>{message}</p>

			{originalName && (
				<p className='text-muted text-sm max-w-lg'>
					Original file: {originalName}
				</p>
			)}

			<ErrorMessage errors={errors} />
		</div>
	);
}
