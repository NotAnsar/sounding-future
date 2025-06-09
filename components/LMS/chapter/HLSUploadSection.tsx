// 'use client';

// import React, { useState, useCallback } from 'react';
// import { Label } from '@/components/ui/label';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import { Loader, Play, Trash, FileVideo } from 'lucide-react';
// import { cn } from '@/lib/utils';
// import ErrorMessage from '@/components/ErrorMessage';
// import { toast } from '@/hooks/use-toast';

// interface HLSUploadSectionProps {
// 	errors?: {
// 		hlsUrl?: string[];
// 	};
// 	initialHlsUrl?: string;
// }

// export default function HLSUploadSection({
// 	errors,
// 	initialHlsUrl,
// }: HLSUploadSectionProps) {
// 	const [hlsDeleted, setHlsDeleted] = useState<boolean>(false);

// 	// Handle HLS deletion
// 	const handleHlsDeleted = useCallback(() => {
// 		setHlsDeleted(true);
// 	}, []);

// 	// Handle HLS restored (when new HLS is uploaded after deletion)
// 	const handleHlsRestored = useCallback(() => {
// 		setHlsDeleted(false);
// 	}, []);

// 	return (
// 		<div className='grid gap-2'>
// 			{/* Hidden input to signal HLS deletion */}
// 			{hlsDeleted && initialHlsUrl && (
// 				<input type='hidden' name='deleteHls' value='true' />
// 			)}

// 			{/* HLS Upload */}
// 			<Label
// 				htmlFor='hlsUrl'
// 				className={cn(errors?.hlsUrl ? 'text-destructive' : '')}
// 			>
// 				HLS Stream (.m3u8)
// 			</Label>

// 			<HLSUploadInput
// 				name='hlsUrl'
// 				errors={errors?.hlsUrl}
// 				message='Upload HLS playlist file (.m3u8), max. 10mb'
// 				url={hlsDeleted ? undefined : initialHlsUrl}
// 				onHlsDeleted={handleHlsDeleted}
// 				onHlsRestored={handleHlsRestored}
// 			/>

// 			<p className='text-muted-foreground text-sm'>
// 				Upload the HLS playlist file (.m3u8) for streaming. Make sure all
// 				segment files (.ts) are uploaded to the same directory.
// 			</p>
// 		</div>
// 	);
// }

// interface HLSUploadInputProps {
// 	name: string;
// 	errors?: string[];
// 	message: string;
// 	accept?: string;
// 	url?: string;
// 	onHlsDeleted?: () => void;
// 	onHlsRestored?: () => void;
// }

// function HLSUploadInput({
// 	name,
// 	errors,
// 	message,
// 	accept = '.m3u8,application/x-mpegURL,application/vnd.apple.mpegurl',
// 	url,
// 	onHlsDeleted,
// 	onHlsRestored,
// }: HLSUploadInputProps) {
// 	const [isPending] = React.useTransition();
// 	const [selectedFile, setSelectedFile] = useState<string | null>(null);

// 	// Handle file change
// 	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
// 		const file = e.target.files?.[0];
// 		if (!file) {
// 			setSelectedFile(null);
// 			return;
// 		}

// 		// Validate file type
// 		if (!file.name.toLowerCase().endsWith('.m3u8')) {
// 			toast({
// 				title: 'Invalid file type',
// 				description: 'Please select a valid .m3u8 HLS playlist file',
// 				variant: 'destructive',
// 			});
// 			e.target.value = '';
// 			return;
// 		}

// 		// Restore HLS if it was deleted and new one is uploaded
// 		onHlsRestored?.();

// 		setSelectedFile(file.name);

// 		toast({
// 			title: 'HLS file selected',
// 			description: `Selected: ${file.name}`,
// 		});
// 	};

// 	const handleDelete = (e: React.FormEvent<HTMLButtonElement>) => {
// 		e.preventDefault();
// 		setSelectedFile(null);
// 		onHlsDeleted?.();

// 		// Clear the file input
// 		const input = document.getElementById(name) as HTMLInputElement;
// 		if (input) input.value = '';

// 		toast({
// 			title: 'HLS file marked for deletion',
// 			description: 'HLS stream will be removed when you save the chapter',
// 		});
// 	};

// 	return (
// 		<div className='grid gap-2'>
// 			<div className='relative max-w-lg'>
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
// 					onChange={handleFileChange}
// 				/>
// 				<FileVideo className='absolute right-3 top-1/2 transform -translate-y-1/2 text-muted w-4 h-auto aspect-square' />
// 			</div>

// 			{/* Show existing HLS URL */}
// 			{url && !selectedFile && (
// 				<div className='flex items-center justify-between'>
// 					<div className='flex items-center gap-2'>
// 						<Play className='w-4 h-4 text-green-600' />
// 						<p className='text-[13px] text-muted'>
// 							HLS Stream: {url.split('/').pop() || 'playlist.m3u8'}
// 						</p>
// 					</div>
// 					<Button
// 						onClick={handleDelete}
// 						disabled={isPending}
// 						variant='destructive'
// 						size='sm'
// 					>
// 						<Trash className='w-4 h-4' />
// 					</Button>
// 				</div>
// 			)}

// 			{/* Show selected file */}
// 			{selectedFile && (
// 				<div className='flex items-center justify-between'>
// 					<div className='flex items-center gap-2'>
// 						<FileVideo className='w-4 h-4 text-blue-600' />
// 						<p className='text-[13px] text-muted'>Selected: {selectedFile}</p>
// 					</div>
// 					<Button
// 						onClick={handleDelete}
// 						disabled={isPending}
// 						variant='destructive'
// 						size='sm'
// 					>
// 						{isPending ? (
// 							<Loader className='h-4 w-4 animate-spin' />
// 						) : (
// 							<Trash className='w-4 h-4' />
// 						)}
// 					</Button>
// 				</div>
// 			)}

// 			<p className='text-muted text-sm max-w-lg'>{message}</p>
// 			<ErrorMessage errors={errors} />
// 		</div>
// 	);
// }

'use client';

import React, { useState, useCallback } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader, Play, Trash, FileVideo, Files } from 'lucide-react';
import { cn } from '@/lib/utils';
import ErrorMessage from '@/components/ErrorMessage';
import { toast } from '@/hooks/use-toast';

interface HLSUploadSectionProps {
	errors?: {
		hlsUrl?: string[];
	};
	initialHlsUrl?: string;
}

export default function HLSUploadSection({
	errors,
	initialHlsUrl,
}: HLSUploadSectionProps) {
	const [hlsDeleted, setHlsDeleted] = useState<boolean>(false);

	// Handle HLS deletion
	const handleHlsDeleted = useCallback(() => {
		setHlsDeleted(true);
	}, []);

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
			/>

			<p className='text-muted-foreground text-sm'>
				Upload all HLS files: 1 playlist file (.m3u8) + all segment files (.ts).
				Select all files at once using Ctrl+Click or Shift+Click.
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
}

function HLSUploadInput({
	name,
	errors,
	message,
	accept = '.m3u8,.ts,application/x-mpegURL,application/vnd.apple.mpegurl,video/mp2t',
	url,
	onHlsDeleted,
	onHlsRestored,
}: HLSUploadInputProps) {
	const [isPending] = React.useTransition();
	const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

	// Handle file change
	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files || files.length === 0) {
			setSelectedFiles(null);
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

		toast({
			title: 'HLS files selected',
			description: `Selected ${files.length} files: ${m3u8Files.length} playlist, ${tsFiles.length} segments`,
		});
	};

	const handleDelete = (e: React.FormEvent<HTMLButtonElement>) => {
		e.preventDefault();
		setSelectedFiles(null);
		onHlsDeleted?.();

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
				/>
				<Files className='absolute right-3 top-1/2 transform -translate-y-1/2 text-muted w-4 h-auto aspect-square' />
			</div>

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
							disabled={isPending}
							variant='destructive'
							size='sm'
						>
							{isPending ? (
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
