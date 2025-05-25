'use client';

import React, { useState, useCallback } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
	Download,
	Trash,
	FileText,
	ImageIcon,
	File,
	FileSpreadsheet,
	Presentation,
	FileArchive,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import ErrorMessage from '@/components/ErrorMessage';
import { toast } from '@/hooks/use-toast';

// Helper function to get file icon based on type
const getFileIcon = (fileType: string) => {
	if (fileType.includes('pdf')) return <FileText className='w-5 h-5' />;
	if (fileType.includes('image')) return <ImageIcon className='w-5 h-5' />;
	if (fileType.includes('word') || fileType.includes('document'))
		return <FileText className='w-5 h-5' />;
	if (fileType.includes('excel') || fileType.includes('spreadsheet'))
		return <FileSpreadsheet className='w-5 h-5' />;
	if (fileType.includes('powerpoint') || fileType.includes('presentation'))
		return <Presentation className='w-5 h-5' />;
	if (fileType.includes('text')) return <FileText className='w-5 h-5' />;
	if (fileType.includes('zip')) return <FileArchive className='w-5 h-5' />;
	return <File className='w-5 h-5' />;
};

// Helper function to format file size
const formatFileSize = (bytes: number): string => {
	if (bytes === 0) return '0 Bytes';
	const k = 1024;
	const sizes = ['Bytes', 'KB', 'MB', 'GB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

interface DownloadsUploadSectionProps {
	errors?: string[];
	initialDownloads?: string[];
}

export default function DownloadsUploadSection({
	errors,
	initialDownloads = [],
}: DownloadsUploadSectionProps) {
	const [previewFiles, setPreviewFiles] = useState<File[]>([]);
	const [deletedDownloads, setDeletedDownloads] = useState<Set<string>>(
		new Set()
	);

	// Handle new file uploads - just for preview
	const handleFilesChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const files = Array.from(e.target.files || []);
			if (files.length > 0) {
				setPreviewFiles(files);
				toast({
					title: 'Files selected',
					description: `${files.length} file(s) ready for upload`,
				});
			}
		},
		[]
	);

	// Clear selected files
	const clearFiles = useCallback(() => {
		setPreviewFiles([]);
		// Reset the file input
		const fileInput = document.getElementById('downloads') as HTMLInputElement;
		if (fileInput) {
			fileInput.value = '';
		}
	}, []);

	// Mark existing download for deletion
	const markForDeletion = useCallback((downloadUrl: string) => {
		setDeletedDownloads((prev) => new Set([...Array.from(prev), downloadUrl]));
		toast({
			title: 'File marked for deletion',
			description: 'File will be removed when you save the chapter',
		});
	}, []);

	// Restore deleted download
	const restoreDownload = useCallback((downloadUrl: string) => {
		setDeletedDownloads((prev) => {
			const newSet = new Set(prev);
			newSet.delete(downloadUrl);
			return newSet;
		});
		toast({
			title: 'File restored',
			description: 'File will be kept when you save the chapter',
		});
	}, []);

	// Get filename from URL
	const getFilenameFromUrl = (url: string): string => {
		const parts = url.split('/');
		return decodeURIComponent(parts[parts.length - 1]);
	};

	// Filter out deleted downloads
	const activeDownloads = initialDownloads.filter(
		(url) => !deletedDownloads.has(url)
	);

	return (
		<div className='grid gap-4'>
			<div className='grid gap-2'>
				<Label
					htmlFor='downloads'
					className={cn(errors ? 'text-destructive' : '')}
				>
					Download Files
				</Label>

				{/* File Upload Input */}
				<div className='grid gap-2'>
					<div className='relative max-w-lg'>
						<Input
							type='file'
							name='downloads'
							id='downloads'
							accept='.pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip'
							multiple
							className={cn(
								'cursor-pointer h-9 file:h-full file:border-0',
								'file:bg-transparent file:cursor-pointer',
								'flex items-center justify-between',
								errors
									? 'border-destructive focus-visible:ring-destructive'
									: ''
							)}
							onChange={handleFilesChange}
						/>
						<Download className='absolute right-3 top-1/2 transform -translate-y-1/2 text-muted w-4 h-auto aspect-square' />
					</div>

					<p className='text-muted-foreground text-sm'>
						Upload files that students can download. Supports PDF, images,
						documents, spreadsheets, presentations, text files, and ZIP
						archives. Max 10MB per file.
					</p>
					<ErrorMessage errors={errors} />
				</div>

				{/* Hidden inputs for deleted downloads */}
				{Array.from(deletedDownloads).map((url, index) => (
					<input
						key={`delete-${index}`}
						type='hidden'
						name={`deleteDownloads[${index}]`}
						value={url}
					/>
				))}
			</div>

			{/* Existing Downloads */}
			{initialDownloads.length > 0 && (
				<div className='grid gap-2'>
					<Label className='text-sm font-medium'>Existing Downloads</Label>
					<div className='grid gap-2'>
						{initialDownloads.map((downloadUrl, index) => {
							const filename = getFilenameFromUrl(downloadUrl);
							const isDeleted = deletedDownloads.has(downloadUrl);

							return (
								<div
									key={`existing-${index}`}
									className={cn(
										'flex items-center justify-between p-3 border rounded-lg',
										isDeleted
											? 'bg-destructive/10 border-destructive/20'
											: 'bg-muted/50'
									)}
								>
									<div className='flex items-center gap-3'>
										<FileText className='w-5 h-5 text-muted-foreground' />
										<div className='grid gap-1'>
											<span
												className={cn(
													'text-sm font-medium',
													isDeleted && 'line-through text-muted-foreground'
												)}
											>
												{filename}
											</span>
											<a
												href={downloadUrl}
												target='_blank'
												rel='noopener noreferrer'
												className='text-xs text-blue-600 hover:text-blue-800 underline'
											>
												View file
											</a>
										</div>
									</div>

									<div className='flex items-center gap-2'>
										{isDeleted ? (
											<Button
												type='button'
												onClick={() => restoreDownload(downloadUrl)}
												variant='outline'
												size='sm'
											>
												Restore
											</Button>
										) : (
											<Button
												type='button'
												onClick={() => markForDeletion(downloadUrl)}
												variant='destructive'
												size='sm'
											>
												<Trash className='w-4 h-4' />
											</Button>
										)}
									</div>
								</div>
							);
						})}
					</div>
				</div>
			)}

			{/* New Files Preview */}
			{previewFiles.length > 0 && (
				<div className='grid gap-2'>
					<div className='flex items-center justify-between'>
						<Label className='text-sm font-medium'>Files to Upload</Label>
						<Button
							type='button'
							onClick={clearFiles}
							variant='outline'
							size='sm'
						>
							Clear All
						</Button>
					</div>
					<div className='grid gap-2'>
						{previewFiles.map((file, index) => (
							<div
								key={`new-${index}`}
								className='flex items-center justify-between p-3 border rounded-lg bg-green-50 border-green-200'
							>
								<div className='flex items-center gap-3'>
									<div className='text-muted-foreground'>
										{getFileIcon(file.type)}
									</div>
									<div className='grid gap-1'>
										<span className='text-sm font-medium'>{file.name}</span>
										<span className='text-xs text-muted-foreground'>
											{formatFileSize(file.size)}
										</span>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Summary */}
			{(activeDownloads.length > 0 || previewFiles.length > 0) && (
				<div className='p-3 bg-blue-50 border border-blue-200 rounded-lg'>
					<div className='flex items-center gap-2 text-sm text-blue-800'>
						<Download className='w-4 h-4' />
						<span>
							Total downloads: {activeDownloads.length + previewFiles.length}
							{deletedDownloads.size > 0 && (
								<span className='text-red-600 ml-2'>
									({deletedDownloads.size} marked for deletion)
								</span>
							)}
						</span>
					</div>
				</div>
			)}
		</div>
	);
}
