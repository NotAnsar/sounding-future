'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { deleteTopic } from '@/actions/lms/topic-action';
import { toast } from '@/hooks/use-toast';
import { Trash2 } from 'lucide-react';

export function DeleteTopicButton({ id }: { id: string }) {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	async function handleDelete() {
		setLoading(true);
		const result = await deleteTopic(id);

		if (result.success) {
			toast({ description: 'Course topic deleted successfully' });
		} else {
			toast({
				title: 'Error',
				description: result.message || 'Failed to delete course topic',
				variant: 'destructive',
			});
		}

		setLoading(false);
		setOpen(false);
	}

	return (
		<>
			<Button
				variant='ghost'
				size='icon'
				onClick={() => setOpen(true)}
				disabled={loading}
			>
				<Trash2 className='w-5 h-auto aspect-square text-muted' />
			</Button>
			<AlertDialog open={open} onOpenChange={setOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Course Topic</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to delete this course topic? This action
							cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDelete}
							disabled={loading}
							className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
						>
							{loading ? 'Deleting...' : 'Delete'}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
