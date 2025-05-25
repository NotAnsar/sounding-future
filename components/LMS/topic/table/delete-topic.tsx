'use client';

import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { deleteTopic } from '@/actions/lms/topic-action';
import { toast } from '@/hooks/use-toast';
import { Loader, Trash2 } from 'lucide-react';

export const DeleteTopic = ({
	id,
	open,
	setOpen,
}: {
	id: string;
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
	const [state, action] = useFormState(deleteTopic.bind(null, id), {});

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
					<AlertDialogTitle>Delete Course Topic</AlertDialogTitle>
					<AlertDialogDescription>
						Are you sure you want to delete this course topic? This action
						cannot be undone.
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
			{pending ? 'Deleting...' : 'Delete'}
		</Button>
	);
}

export function DeleteTopicButton({ id }: { id: string }) {
	const [open, setOpen] = useState<boolean>(false);

	return (
		<>
			<Button variant='ghost' size='icon' onClick={() => setOpen(true)}>
				<Trash2 className='w-5 h-auto aspect-square text-muted' />
			</Button>
			{open && (
				<DeleteTopic
					id={id}
					open={open}
					setOpen={setOpen}
					key={open ? 'opened' : 'closed'}
				/>
			)}
		</>
	);
}
