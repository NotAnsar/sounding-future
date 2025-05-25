'use client';

import React, { useState, useCallback } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader, TvMinimalPlay, Trash } from 'lucide-react';
import { cn } from '@/lib/utils';
import ErrorMessage from '@/components/ErrorMessage';
import { toast } from '@/hooks/use-toast';

// Helper function to extract video duration
const getVideoDuration = async (file: File): Promise<number> => {
	return new Promise((resolve) => {
		const video = document.createElement('video');
		video.preload = 'metadata';

		video.onloadedmetadata = () => {
			URL.revokeObjectURL(video.src);
			resolve(Math.round(video.duration));
		};

		// Fallback if metadata load fails
		video.onerror = () => {
			console.error('Error loading video metadata');
			URL.revokeObjectURL(video.src);
			resolve(0);
		};

		video.src = URL.createObjectURL(file);
	});
};

// Format duration from seconds to readable format
const formatDuration = (seconds: number): string => {
	if (seconds === 0) return '0:00';

	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = seconds % 60;

	if (minutes >= 60) {
		const hours = Math.floor(minutes / 60);
		const remainingMinutes = minutes % 60;
		return `${hours}:${remainingMinutes
			.toString()
			.padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
	}

	return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

interface VideoUploadSectionProps {
	errors?: {
		videoUrl?: string[];
		videoDuration?: string[];
	};
	initialVideoUrl?: string;
	initialDuration?: number;
	onDurationExtracted?: (duration: number) => void;
}

export default function VideoUploadSection({
	errors,
	initialVideoUrl,
	initialDuration = 0,
	onDurationExtracted,
}: VideoUploadSectionProps) {
	const [duration, setDuration] = useState<number>(initialDuration);
	const [videoDeleted, setVideoDeleted] = useState<boolean>(false);

	// Handle duration update
	const handleDurationExtracted = useCallback(
		(seconds: number) => {
			setDuration(seconds);
			onDurationExtracted?.(seconds);
		},
		[onDurationExtracted]
	);

	// Handle video deletion
	const handleVideoDeleted = useCallback(() => {
		setVideoDeleted(true);
		setDuration(0);
		onDurationExtracted?.(0);
	}, [onDurationExtracted]);

	// Handle video restored (when new video is uploaded after deletion)
	const handleVideoRestored = useCallback(() => {
		setVideoDeleted(false);
	}, []);

	return (
		<div className='grid gap-2'>
			{/* Hidden input for duration */}
			<input type='hidden' name='videoDuration' value={duration} />

			{/* Hidden input to signal video deletion */}
			{videoDeleted && initialVideoUrl && (
				<input type='hidden' name='deleteVideo' value='true' />
			)}

			{/* Video Upload */}
			<Label
				htmlFor='videoUrl'
				className={cn(errors?.videoUrl ? 'text-destructive' : '')}
			>
				Chapter Video
			</Label>

			<VideoUploadInput
				name='videoUrl'
				errors={errors?.videoUrl}
				message='Upload video file, max. 200mb'
				url={videoDeleted ? undefined : initialVideoUrl}
				onDurationExtracted={handleDurationExtracted}
				onVideoDeleted={handleVideoDeleted}
				onVideoRestored={handleVideoRestored}
			/>

			{/* Duration Display */}
			{duration > 0 && (
				<div className='flex items-center gap-2 text-sm text-muted-foreground'>
					<TvMinimalPlay className='w-4 h-4' />
					<span>Duration: {formatDuration(duration)}</span>
				</div>
			)}

			<p className='text-muted-foreground text-sm'>
				Upload a video file for this chapter. Duration will be automatically
				detected.
			</p>
		</div>
	);
}

interface VideoUploadInputProps {
	name: string;
	errors?: string[];
	message: string;
	accept?: string;
	url?: string;
	onDurationExtracted?: (duration: number) => void;
	onVideoDeleted?: () => void;
	onVideoRestored?: () => void;
}

function VideoUploadInput({
	name,
	errors,
	message,
	accept = 'video/*',
	url,
	onDurationExtracted,
	onVideoDeleted,
	onVideoRestored,
}: VideoUploadInputProps) {
	const [isPending] = React.useTransition();
	const [preview, setPreview] = useState<string | null>(null);
	const [isExtracting, setIsExtracting] = useState(false);

	// Handle file change to extract duration and set preview
	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) {
			setPreview(null);
			onDurationExtracted?.(0);
			return;
		}

		// Restore video if it was deleted and new one is uploaded
		onVideoRestored?.();

		// Set preview
		const reader = new FileReader();
		reader.onloadend = () => {
			const result = reader.result as string;
			setPreview(result);
		};
		reader.readAsDataURL(file);

		// Extract duration
		if (onDurationExtracted) {
			setIsExtracting(true);
			try {
				const duration = await getVideoDuration(file);
				onDurationExtracted(duration);

				if (duration > 0) {
					toast({
						title: 'Video processed',
						description: `Duration: ${formatDuration(duration)}`,
					});
				}
			} catch (error) {
				console.error('Failed to extract duration:', error);
				toast({
					title: 'Warning',
					description: 'Could not extract video duration',
					variant: 'destructive',
				});
			} finally {
				setIsExtracting(false);
			}
		}
	};

	const handleDelete = (e: React.FormEvent<HTMLButtonElement>) => {
		e.preventDefault();
		setPreview(null);
		onDurationExtracted?.(0);
		onVideoDeleted?.();

		// Clear the file input
		const input = document.getElementById(name) as HTMLInputElement;
		if (input) input.value = '';

		toast({
			title: 'Video marked for deletion',
			description: 'Video will be removed when you save the chapter',
		});
	};

	return (
		<div className='grid gap-2'>
			<div className='relative max-w-lg'>
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
					disabled={isExtracting}
				/>
				<TvMinimalPlay className='absolute right-3 top-1/2 transform -translate-y-1/2 text-muted w-4 h-auto aspect-square' />
			</div>

			{isExtracting && (
				<div className='flex items-center gap-2 text-sm text-muted-foreground'>
					<Loader className='w-4 h-4 animate-spin' />
					<span>Extracting video duration...</span>
				</div>
			)}

			{url && !preview && (
				<div className='flex items-center justify-between'>
					<p className='text-[13px] text-muted'>
						{url.split('/').pop() || url}
					</p>
					<Button
						onClick={handleDelete}
						disabled={isPending}
						variant='destructive'
						size='sm'
					>
						<Trash className='w-4 h-4' />
					</Button>
				</div>
			)}

			{preview && (
				<div className='flex items-start gap-4'>
					<video
						src={preview}
						controls
						className='w-full max-w-lg aspect-video border border-foreground rounded-xl'
					>
						Your browser does not support the video element.
					</video>
					<Button
						onClick={handleDelete}
						disabled={isPending}
						variant='destructive'
						size='icon'
					>
						{isPending ? (
							<Loader className='h-4 w-4 animate-spin' />
						) : (
							<Trash className='w-4 h-4' />
						)}
					</Button>
				</div>
			)}

			<p className='text-muted text-sm max-w-lg'>{message}</p>
			<ErrorMessage errors={errors} />
		</div>
	);
}
