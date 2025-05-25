'use client';

import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { deleteChapter } from '@/actions/lms/chapter-action';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Loader } from 'lucide-react';

interface DeleteChapterButtonProps {
	id: string;
	title: string;
	courseName: string;
}

export const DeleteChapter = ({
	id,
	title,
	courseName,
	open,
	setOpen,
}: {
	id: string;
	title: string;
	courseName: string;
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
	const [state, action] = useFormState(deleteChapter.bind(null, id), {});

	useEffect(() => {
		if (state?.message) {
			setOpen(false);
			toast({
				description: state?.message,
				variant: state.success ? 'default' : 'destructive',
			});
		}
	}, [state, setOpen]);

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
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
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<form action={action}>
						<PendingButton />
					</form>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

function PendingButton() {
	const { pending } = useFormStatus();

	return (
		<Button
			type='submit'
			aria-disabled={pending}
			disabled={pending}
			className='bg-destructive text-white hover:bg-destructive/90 w-full'
		>
			{pending && <Loader className='mr-2 h-4 w-4 animate-spin' />}
			{pending ? 'Deleting...' : 'Delete Chapter'}
		</Button>
	);
}

export function DeleteChapterButton({
	id,
	title,
	courseName,
}: DeleteChapterButtonProps) {
	const [open, setOpen] = useState<boolean>(false);

	return (
		<>
			<button
				className='flex items-center justify-start w-full h-auto p-0 text-destructive hover:text-destructive'
				onClick={() => setOpen(true)}
			>
				Delete chapter
			</button>
			{open && (
				<DeleteChapter
					id={id}
					title={title}
					courseName={courseName}
					open={open}
					setOpen={setOpen}
					key={open ? 'opened' : 'closed'}
				/>
			)}
		</>
	);
}
