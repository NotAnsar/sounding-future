'use client';

import React, { useState, useCallback } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
	Loader,
	Play,
	Trash,
	FileVideo,
	Files,
	TvMinimalPlay,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import ErrorMessage from '@/components/ErrorMessage';
import { toast } from '@/hooks/use-toast';

// Helper function to extract duration from HLS playlist
const getHLSDuration = async (file: File): Promise<number> => {
	return new Promise((resolve) => {
		const reader = new FileReader();

		reader.onload = () => {
			try {
				const content = reader.result as string;
				let totalDuration = 0;

				// Parse the playlist to extract segment durations
				const lines = content.split('\n');

				for (const line of lines) {
					// Look for #EXTINF lines which contain duration info
					if (line.startsWith('#EXTINF:')) {
						// Extract duration from #EXTINF:duration,
						const match = line.match(/#EXTINF:([\d.]+),/);
						if (match) {
							const segmentDuration = parseFloat(match[1]);
							totalDuration += segmentDuration;
						}
					}
				}

				resolve(Math.round(totalDuration));
			} catch (error) {
				console.error('Error parsing HLS playlist:', error);
				resolve(0);
			}
		};

		reader.onerror = () => {
			console.error('Error reading HLS playlist file');
			resolve(0);
		};

		reader.readAsText(file);
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

interface HLSUploadSectionProps {
	errors?: {
		hlsUrl?: string[];
	};
	initialHlsUrl?: string;
	initialDuration?: number;
	onDurationExtracted?: (duration: number) => void;
}

export default function HLSUploadSection({
	errors,
	initialHlsUrl,
	initialDuration = 0,
	onDurationExtracted,
}: HLSUploadSectionProps) {
	const [hlsDeleted, setHlsDeleted] = useState<boolean>(false);
	const [duration, setDuration] = useState<number>(initialDuration);

	// Handle duration update
	const handleDurationExtracted = useCallback(
		(seconds: number) => {
			setDuration(seconds);
			onDurationExtracted?.(seconds);
		},
		[onDurationExtracted]
	);

	// Handle HLS deletion
	const handleHlsDeleted = useCallback(() => {
		setHlsDeleted(true);
		setDuration(0);
		onDurationExtracted?.(0);
	}, [onDurationExtracted]);

	// Handle HLS restored (when new HLS is uploaded after deletion)
	const handleHlsRestored = useCallback(() => {
		setHlsDeleted(false);
	}, []);

	return (
		<div className='grid gap-2'>
			{/* Hidden input to signal HLS deletion */}
			{hlsDeleted && initialHlsUrl && (
				<input type='hidden' name='deleteHls' value='true' />
			)}

			{/* HLS Upload */}
			<Label
				htmlFor='hlsFiles'
				className={cn(errors?.hlsUrl ? 'text-destructive' : '')}
			>
				HLS Stream Files (.m3u8 + .ts)
			</Label>

			<HLSUploadInput
				name='hlsFiles'
				errors={errors?.hlsUrl}
				message='Upload HLS playlist (.m3u8) and all segment files (.ts), max 50mb total'
				url={hlsDeleted ? undefined : initialHlsUrl}
				onHlsDeleted={handleHlsDeleted}
				onHlsRestored={handleHlsRestored}
				onDurationExtracted={handleDurationExtracted}
			/>

			{/* Duration Display */}
			{duration > 0 && (
				<div className='flex items-center gap-2 text-sm text-muted-foreground'>
					<TvMinimalPlay className='w-4 h-4' />
					<span>HLS Duration: {formatDuration(duration)}</span>
				</div>
			)}

			<p className='text-muted-foreground text-sm'>
				Upload all HLS files: 1 playlist file (.m3u8) + all segment files (.ts).
				Select all files at once using Ctrl+Click or Shift+Click. Duration will
				be extracted automatically.
			</p>
		</div>
	);
}

interface HLSUploadInputProps {
	name: string;
	errors?: string[];
	message: string;
	accept?: string;
	url?: string;
	onHlsDeleted?: () => void;
	onHlsRestored?: () => void;
	onDurationExtracted?: (duration: number) => void;
}

function HLSUploadInput({
	name,
	errors,
	message,
	accept = '.m3u8,.ts,application/x-mpegURL,application/vnd.apple.mpegurl,video/mp2t',
	url,
	onHlsDeleted,
	onHlsRestored,
	onDurationExtracted,
}: HLSUploadInputProps) {
	const [isPending] = React.useTransition();
	const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
	const [isExtracting, setIsExtracting] = useState(false);

	// Handle file change
	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files || files.length === 0) {
			setSelectedFiles(null);
			onDurationExtracted?.(0);
			return;
		}

		// Validate that we have both .m3u8 and .ts files
		const fileArray = Array.from(files);
		const m3u8Files = fileArray.filter((f) =>
			f.name.toLowerCase().endsWith('.m3u8')
		);
		const tsFiles = fileArray.filter((f) =>
			f.name.toLowerCase().endsWith('.ts')
		);

		// Validation checks
		if (m3u8Files.length === 0) {
			toast({
				title: 'Missing playlist file',
				description: 'Please include at least one .m3u8 playlist file',
				variant: 'destructive',
			});
			e.target.value = '';
			return;
		}

		if (m3u8Files.length > 1) {
			toast({
				title: 'Too many playlist files',
				description: 'Please include only one .m3u8 playlist file',
				variant: 'destructive',
			});
			e.target.value = '';
			return;
		}

		if (tsFiles.length === 0) {
			toast({
				title: 'Missing segment files',
				description: 'Please include .ts segment files along with the playlist',
				variant: 'destructive',
			});
			e.target.value = '';
			return;
		}

		// Check total file size (50MB limit)
		const totalSize = fileArray.reduce((sum, file) => sum + file.size, 0);
		const maxSize = 50 * 1024 * 1024; // 50MB

		if (totalSize > maxSize) {
			toast({
				title: 'Files too large',
				description: `Total file size (${(totalSize / (1024 * 1024)).toFixed(
					1
				)}MB) exceeds 50MB limit`,
				variant: 'destructive',
			});
			e.target.value = '';
			return;
		}

		// Restore HLS if it was deleted and new files are uploaded
		onHlsRestored?.();
		setSelectedFiles(files);

		// Extract duration from the playlist file
		if (onDurationExtracted) {
			setIsExtracting(true);
			try {
				const playlistFile = m3u8Files[0];
				const duration = await getHLSDuration(playlistFile);
				onDurationExtracted(duration);

				if (duration > 0) {
					toast({
						title: 'HLS files processed',
						description: `${
							files.length
						} files selected. Duration: ${formatDuration(duration)}`,
					});
				} else {
					toast({
						title: 'HLS files selected',
						description: `${files.length} files selected. Could not extract duration.`,
					});
				}
			} catch (error) {
				console.error('Failed to extract HLS duration:', error);
				toast({
					title: 'HLS files selected',
					description: `${files.length} files selected. Could not extract duration.`,
				});
			} finally {
				setIsExtracting(false);
			}
		} else {
			toast({
				title: 'HLS files selected',
				description: `Selected ${files.length} files: ${m3u8Files.length} playlist, ${tsFiles.length} segments`,
			});
		}
	};

	const handleDelete = (e: React.FormEvent<HTMLButtonElement>) => {
		e.preventDefault();
		setSelectedFiles(null);
		onHlsDeleted?.();
		onDurationExtracted?.(0);

		// Clear the file input
		const input = document.getElementById(name) as HTMLInputElement;
		if (input) input.value = '';

		toast({
			title: 'HLS files marked for deletion',
			description: 'HLS stream will be removed when you save the chapter',
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
					multiple // IMPORTANT: Allow multiple files
					className={cn(
						'cursor-pointer h-9 file:h-full file:border-0',
						'file:bg-transparent file:cursor-pointer',
						'flex items-center justify-between',
						errors ? 'border-destructive focus-visible:ring-destructive' : ''
					)}
					onChange={handleFileChange}
					disabled={isExtracting}
				/>
				<Files className='absolute right-3 top-1/2 transform -translate-y-1/2 text-muted w-4 h-auto aspect-square' />
			</div>

			{isExtracting && (
				<div className='flex items-center gap-2 text-sm text-muted-foreground'>
					<Loader className='w-4 h-4 animate-spin' />
					<span>Extracting HLS duration from playlist...</span>
				</div>
			)}

			{/* Show existing HLS URL */}
			{url && !selectedFiles && (
				<div className='flex items-center justify-between'>
					<div className='flex items-center gap-2'>
						<Play className='w-4 h-4 text-green-600' />
						<p className='text-[13px] text-muted'>
							HLS Stream: {url.split('/').pop() || 'playlist.m3u8'}
						</p>
					</div>
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

			{/* Show selected files */}
			{selectedFiles && (
				<div className='grid gap-2'>
					<div className='flex items-center justify-between'>
						<div className='flex items-center gap-2'>
							<FileVideo className='w-4 h-4 text-blue-600' />
							<p className='text-[13px] text-muted'>
								Selected {selectedFiles.length} HLS files
							</p>
						</div>
						<Button
							onClick={handleDelete}
							disabled={isPending || isExtracting}
							variant='destructive'
							size='sm'
						>
							{isPending || isExtracting ? (
								<Loader className='h-4 w-4 animate-spin' />
							) : (
								<Trash className='w-4 h-4' />
							)}
						</Button>
					</div>

					{/* File list preview */}
					<div className='max-h-32 overflow-y-auto bg-muted/50 rounded p-2'>
						<div className='text-xs space-y-1'>
							{Array.from(selectedFiles).map((file, index) => (
								<div
									key={index}
									className='flex justify-between text-muted-foreground'
								>
									<span className='truncate'>{file.name}</span>
									<span>{(file.size / 1024).toFixed(1)}KB</span>
								</div>
							))}
						</div>
					</div>
				</div>
			)}

			<p className='text-muted text-sm max-w-lg'>{message}</p>
			<ErrorMessage errors={errors} />
		</div>
	);
}
