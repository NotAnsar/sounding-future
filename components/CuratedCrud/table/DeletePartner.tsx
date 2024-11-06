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
import { useState } from 'react';
import { useFormStatus } from 'react-dom';
// import { useFormState, useFormStatus } from 'react-dom';
import { Button, buttonVariants } from '../../ui/button';
import { Loader, Trash2 } from 'lucide-react';
import { AlertDialogTrigger } from '@radix-ui/react-alert-dialog';

export const DeletePartner = ({ id }: { id: string }) => {
	const [open, setOpen] = useState<boolean>(false);
	console.log(id);

	// const initialState: DeleteProductState = { message: null, type: null };
	// const [state, action] = useFormState(
	// 	deleteProduct.bind(null, id),
	// 	initialState
	// );

	// useEffect(() => {
	// 	if (state.message) {
	// 		setOpen(false);
	// 		toast({
	// 			description: state.message,
	// 			variant: state.type === 'error' ? 'destructive' : 'default',
	// 		});
	// 	}
	// }, [state, setOpen]);

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger>
				<div className={buttonVariants({ variant: 'ghost' })}>
					<Trash2 className='w-5 h-auto aspect-square text-muted' />
				</div>
			</AlertDialogTrigger>
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
		<Button type='button' variant={'destructive'}>
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
