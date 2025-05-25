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
import { deleteCourse } from '@/actions/lms/course-action';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Loader } from 'lucide-react';

export const DeleteCourse = ({
	id,
	open,
	setOpen,
}: {
	id: string;
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
	const [state, action] = useFormState(deleteCourse.bind(null, id), {});

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
					<AlertDialogTitle>Delete Course</AlertDialogTitle>
					<AlertDialogDescription>
						Are you sure you want to delete this course? This action cannot be
						undone. All chapters associated with this course will also be
						deleted.
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
			{pending ? 'Deleting...' : 'Delete Course'}
		</Button>
	);
}

export function DeleteCourseButton({ id }: { id: string }) {
	const [open, setOpen] = useState<boolean>(false);

	return (
		<>
			<button onClick={() => setOpen(true)}>Delete Course</button>
			{open && (
				<DeleteCourse
					id={id}
					open={open}
					setOpen={setOpen}
					key={open ? 'opened' : 'closed'}
				/>
			)}
		</>
	);
}
