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
import { toast } from '@/hooks/use-toast';
import { NewsLetter } from '@prisma/client';
import ErrorMessage from '../ErrorMessage';
import {
	NewsLetterState,
	updateNewsLetter,
} from '@/actions/sections/newsletter';
import { Textarea } from '../ui/textarea';

export function NewsLetterDialog({
	open,
	setopen,
	initialData,
}: {
	initialData?: NewsLetter;
	open: boolean;
	setopen: Dispatch<SetStateAction<boolean>>;
}) {
	const initialState: NewsLetterState = { message: null, errors: {} };
	const [state, action] = useFormState(updateNewsLetter, initialState);

	useEffect(() => {
		if (!state) return;

		const handleStateChange = () => {
			setopen(false);
			toast({
				variant: state.success ? 'default' : 'destructive',
				title: state.success ? 'Success' : 'Error',
				description: state.success
					? 'NewsLetter Section updated successfully'
					: state.message || 'Failed to update NewsLetter Section',
			});
		};

		if (state.success !== undefined) {
			handleStateChange();
		}
	}, [state, setopen]);

	return (
		<Dialog open={open} onOpenChange={setopen}>
			<DialogContent className='sm:max-w-[620px]'>
				<DialogHeader>
					<DialogTitle>Update NewsLetter Section</DialogTitle>
					<DialogDescription>
						{
							"Update NewsLetter Section. Enter the NewsLetter details and click save when you're done."
						}
					</DialogDescription>
				</DialogHeader>

				<form className='grid gap-2 ' id='update' action={action}>
					<div className='grid gap-2 items-center'>
						<Label
							htmlFor='title'
							className={cn(state?.errors?.title ? 'text-destructive' : '')}
						>
							Title
						</Label>

						<Input
							type='text'
							name='title'
							id='title'
							defaultValue={initialData?.title || undefined}
							className={cn(
								'flex-1',
								state?.errors?.title
									? 'border-destructive focus-visible:ring-destructive '
									: ''
							)}
							required
						/>

						<ErrorMessage errors={state?.errors?.title} />
					</div>
					<div className='grid gap-2 items-center'>
						<Label
							htmlFor='content'
							className={cn(state?.errors?.content ? 'text-destructive' : '')}
						>
							Section Content
						</Label>

						<Textarea
							name='content'
							id='content'
							defaultValue={initialData?.content || undefined}
							className={cn(
								'flex-1',
								state?.errors?.content
									? 'border-destructive focus-visible:ring-destructive '
									: ''
							)}
							rows={6}
							required
						/>

						<ErrorMessage errors={state?.errors?.content} />
					</div>

					<div className='grid gap-2 items-center'>
						<Label
							htmlFor='label'
							className={cn(state?.errors?.label ? 'text-destructive' : '')}
						>
							Buttom Text
						</Label>

						<Input
							type='text'
							name='label'
							id='label'
							defaultValue={initialData?.label || undefined}
							className={cn(
								'flex-1',
								state?.errors?.label
									? 'border-destructive focus-visible:ring-destructive '
									: ''
							)}
							required
						/>

						<ErrorMessage errors={state?.errors?.label} />
					</div>
					<div className='grid gap-2 items-center'>
						<Label
							htmlFor='link'
							className={cn(state?.errors?.link ? 'text-destructive' : '')}
						>
							Buttom Link
						</Label>

						<Input
							type='text'
							name='link'
							id='link'
							defaultValue={initialData?.link || undefined}
							className={cn(
								'flex-1',
								state?.errors?.link
									? 'border-destructive focus-visible:ring-destructive '
									: ''
							)}
							required
						/>

						<ErrorMessage errors={state?.errors?.link} />
					</div>

					<DialogFooter>
						{(state?.message || state?.errors) && (
							<p className='text-sm font-medium text-destructive mr-auto'>
								{state?.message}
							</p>
						)}
						<PendingButton />
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

function PendingButton() {
	const { pending } = useFormStatus();

	return (
		<Button type='submit' aria-disabled={pending} disabled={pending}>
			{pending ? (
				<Loader className='mr-2 h-4 w-4 animate-spin' />
			) : (
				<Plus className='mr-2 h-4 w-4' />
			)}
			Update NewsLetter
		</Button>
	);
}

export function EditNewsLetterButton({
	data,
	children,
}: {
	data?: NewsLetter;
	children: React.ReactNode;
}) {
	const [open, setOpen] = useState(false);

	return (
		<>
			<span className='cursor-pointer' onClick={() => setOpen(true)}>
				{children}
			</span>
			<NewsLetterDialog
				open={open}
				setopen={setOpen}
				initialData={data}
				key={open ? 'open' : 'close'}
			/>
		</>
	);
}
