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
import {
	FormatState,
	createFormat,
	updateFormat,
} from '@/actions/format-action';
import { toast } from '@/hooks/use-toast';
import { SourceFormat } from '@/config/tags';
import { Icons } from '@/components/icons/track-icons';

export function FormatDialog({
	open,
	setopen,
	initialData,
}: {
	initialData?: SourceFormat;
	open: boolean;
	setopen: Dispatch<SetStateAction<boolean>>;
}) {
	const isEdit = !!initialData?.id;
	const initialState: FormatState = { message: null, errors: {} };
	const [state, action] = useFormState(
		isEdit ? updateFormat.bind(null, initialData.id) : createFormat,
		initialState
	);

	useEffect(() => {
		if (state === undefined) {
			setopen(false);

			toast({
				description: `Format Tag ${
					isEdit ? 'updated' : 'created'
				} successfully.`,
			});
		}
	}, [state, setopen, isEdit]);

	return (
		<Dialog open={open} onOpenChange={setopen}>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle>{isEdit ? 'Update' : 'Create'} Format</DialogTitle>
					<DialogDescription>
						{isEdit
							? 'Update Format Source Tag.'
							: 'Create a new Format Source Tag.'}
						{
							" Enter the Format Source details and click save when you're done."
						}
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
								Format Name
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
			{isUpdate ? 'Update' : 'Add'} Format
		</Button>
	);
}

export function CreateFormatButton() {
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

	return (
		<>
			<Button
				onClick={() => setIsCreateDialogOpen(true)}
				className='w-full sm:w-auto'
			>
				<Plus className='w-4 h-auto aspect-square mr-2' /> Add Source Format
			</Button>
			<FormatDialog open={isCreateDialogOpen} setopen={setIsCreateDialogOpen} />
		</>
	);
}

export function EditFormatButton({ data }: { data: SourceFormat }) {
	const [open, setOpen] = useState(false);

	return (
		<>
			<Button variant={'ghost'} onClick={() => setOpen(true)}>
				<Icons.edit className='w-5 h-auto aspect-square fill-muted text-muted' />
			</Button>
			<FormatDialog open={open} setopen={setOpen} initialData={data} />
		</>
	);
}
