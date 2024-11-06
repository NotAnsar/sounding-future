'use client';

import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Dispatch, SetStateAction } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '../../ui/button';
import { Loader } from 'lucide-react';

export const DeleteTrack = ({
	id,
	setOpen,
	open,
}: {
	id: string;
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
	console.log(id);

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently delete your
						Partner and remove its data from our servers.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>

					<form /* action={action} */>
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
		<Button type='button' variant={'destructive'} className='w-full'>
			Delete
		</Button>
	);
	return (
		<Button
			type='submit'
			aria-disabled={pending}
			disabled={pending}
			className='bg-destructive text-white hover:bg-destructive/90 w-full'
		>
			{pending && <Loader className='mr-2 h-4 w-4 animate-spin' />}
			Delete
		</Button>
	);
}
