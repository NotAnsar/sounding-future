import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
// import { toast } from '../../ui/use-toast';
// import { DeleteProductState, deleteProduct } from '@/actions/product-action';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
// import { useFormState, useFormStatus } from 'react-dom';
import { Button } from '../../ui/button';
import { Loader, Trash2 } from 'lucide-react';
import { deletePartner } from '@/actions/curated';
import { toast } from '@/hooks/use-toast';

export const DeletePartner = ({
	id,
	open,
	setOpen,
}: {
	id: string;
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
	const [state, action] = useFormState(deletePartner.bind(null, id), {});

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
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently delete your
						Partner and remove its data from our servers.
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
			Delete
		</Button>
	);
}

export function DeletePartnerButton({ id }: { id: string }) {
	const [open, setOpen] = useState<boolean>(false);

	return (
		<>
			<Button variant={'ghost'} onClick={() => setOpen(true)}>
				<Trash2 className='w-5 h-auto aspect-square text-muted' />
			</Button>
			{open && (
				<DeletePartner
					id={id}
					open={open}
					setOpen={setOpen}
					key={open ? 'opened' : 'closed'}
				/>
			)}
		</>
	);
}
