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
} from '@/components/ui/alert-dialog';
import { deleteCourse } from '@/actions/lms/course-action';
import { toast } from '@/hooks/use-toast';

export function DeleteCourseButton({ id }: { id: string }) {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	async function handleDelete() {
		setLoading(true);
		const response = await deleteCourse(id);

		if (response.success) {
			toast({ description: 'Course deleted successfully' });
		} else {
			toast({
				title: 'Error',
				description: response.message || 'Failed to delete course',
				variant: 'destructive',
			});
		}

		setLoading(false);
		setOpen(false);
	}

	return (
		<>
			<button onClick={() => setOpen(true)} disabled={loading}>
				Delete Course
			</button>
			<AlertDialog open={open} onOpenChange={setOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Course</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to delete this course? This action cannot be
							undone. All chapters associated with this course will also be
							deleted.
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
