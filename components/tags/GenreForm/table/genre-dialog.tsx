'use client';

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Loader, Plus } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import { cn } from '@/lib/utils';
import { useFormState } from 'react-dom';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { GenreState, createGenre, updateGenre } from '@/actions/genre-action';
import { toast } from '@/hooks/use-toast';
import { Icons } from '@/components/icons/track-icons';
import { Genre } from '@prisma/client';

export function GenreDialog({
	open,
	setopen,
	initialData,
}: {
	initialData?: Genre;
	open: boolean;
	setopen: Dispatch<SetStateAction<boolean>>;
}) {
	const isEdit = !!initialData?.id;
	const initialState: GenreState = {
		message: undefined,
		errors: {},
	};
	const [state, action] = useFormState(
		isEdit ? updateGenre.bind(null, initialData.id) : createGenre,
		initialState
	);

	useEffect(() => {
		if (state === undefined) {
			setopen(false);

			toast({
				description: `Genre Tag ${
					isEdit ? 'updated' : 'created'
				} successfully.`,
			});
		}
	}, [state, setopen, isEdit]);

	return (
		<Dialog open={open} onOpenChange={setopen}>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle>{isEdit ? 'Update' : 'Create'} Genre</DialogTitle>
					<DialogDescription>
						{isEdit ? 'Update a genre Tags.' : 'Create a new genre Tags.'}
						{" Enter the genre details and click save when you're done."}
					</DialogDescription>
				</DialogHeader>

				<form className='grid gap-4 ' id='update' action={action}>
					<div>
						<div className='flex items-center gap-4'>
							<Label
								htmlFor='fname'
								className={cn(
									'text-nowrap',
									state?.errors?.name ? 'text-destructive' : ''
								)}
							>
								Genre Name
							</Label>
							<Input
								id='name'
								name='name'
								defaultValue={initialData?.name || undefined}
								className={cn(
									'bg-transparent col-span-3',
									state?.errors?.name
										? 'border-destructive focus-visible:ring-destructive '
										: ''
								)}
							/>
						</div>
						{state?.errors?.name &&
							state.errors.name.map((error: string) => (
								<p
									className='text-sm font-medium text-destructive col-span-full mt-2'
									key={error}
								>
									{error}
								</p>
							))}
					</div>

					<DialogFooter>
						{(state?.message || state?.errors) && (
							<p className='text-sm font-medium text-destructive mr-auto'>
								{state.message}
							</p>
						)}
						<PendingButton isUpdate={!!initialData} />
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

function PendingButton({ isUpdate = false }: { isUpdate?: boolean }) {
	const { pending } = useFormStatus();

	return (
		<Button type='submit' aria-disabled={pending} disabled={pending}>
			{pending ? (
				<Loader className='mr-2 h-4 w-4 animate-spin' />
			) : (
				<Plus className='mr-2 h-4 w-4' />
			)}
			{isUpdate ? 'Update' : 'Add'} Genre
		</Button>
	);
}

export function CreateGenreButton() {
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

	return (
		<>
			<Button onClick={() => setIsCreateDialogOpen(true)}>
				<Plus className='w-4 h-auto aspect-square mr-2' /> Add Genre
			</Button>
			<GenreDialog
				open={isCreateDialogOpen}
				setopen={setIsCreateDialogOpen}
				key={isCreateDialogOpen ? 'opened' : 'closed'}
			/>
		</>
	);
}

export function EditGenreButton({ data }: { data: Genre }) {
	const [open, setOpen] = useState(false);

	return (
		<>
			<Button variant={'ghost'} onClick={() => setOpen(true)}>
				<Icons.edit className='w-5 h-auto aspect-square fill-muted text-muted' />
			</Button>
			{open && (
				<GenreDialog
					open={open}
					setopen={setOpen}
					initialData={data}
					key={open ? 'opened' : 'closed'}
				/>
			)}
		</>
	);
}
