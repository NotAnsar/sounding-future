'use client';

import { useState } from 'react';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { deleteChapter } from '@/actions/lms/chapter-action';
import { toast } from '@/hooks/use-toast';

interface DeleteChapterButtonProps {
	id: string;
	title: string;
	courseName: string;
}

export function DeleteChapterButton({
	id,
	title,
	courseName,
}: DeleteChapterButtonProps) {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	async function handleDelete() {
		setLoading(true);

		try {
			const response = await deleteChapter(id);

			if (response.success) {
				toast({
					description: `Chapter "${title}" deleted successfully`,
				});
			} else {
				toast({
					title: 'Error',
					description: response.message || 'Failed to delete chapter',
					variant: 'destructive',
				});
			}
		} catch (error) {
			toast({
				title: 'Error',
				description: 'An unexpected error occurred',
				variant: 'destructive',
			});
		} finally {
			setLoading(false);
			setOpen(false);
		}
	}

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>
				<button
					className='flex items-center justify-start w-full h-auto p-0 text-destructive hover:text-destructive'
					disabled={loading}
				>
					{loading ? 'Deleting...' : 'Delete chapter'}
				</button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Delete Chapter</AlertDialogTitle>
					<AlertDialogDescription className='space-y-2'>
						<p>
							Are you sure you want to delete the chapter{' '}
							<strong>&quot;{title}&quot;</strong>
							from the course <strong>&quot;{courseName}&quot;</strong>?
						</p>
						<p className='text-sm'>
							This action cannot be undone. All associated files (video,
							thumbnail) will also be permanently deleted.
						</p>
						{/* Warning about course unpublishing */}
						<div className='bg-destructive/40 border border-destructive/20 rounded-md p-3 mt-3'>
							<p className='text-sm text-destructive-foreground font-medium'>
								⚠️ Note: If this is the last published chapter in the course,
								the course will be automatically unpublished.
							</p>
						</div>
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
					<AlertDialogAction
						onClick={handleDelete}
						disabled={loading}
						className='bg-destructive/70 text-destructive-foreground hover:bg-destructive/90'
					>
						{loading ? 'Deleting...' : 'Delete Chapter'}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
