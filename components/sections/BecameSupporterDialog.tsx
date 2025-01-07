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
	SubscriptionState,
	updateSubscription,
} from '@/actions/sections/subscription';
import { Textarea } from '../ui/textarea';

export function SubscriptionDialog({
	open,
	setopen,
	initialData,
}: {
	initialData?: NewsLetter;
	open: boolean;
	setopen: Dispatch<SetStateAction<boolean>>;
}) {
	const initialState: SubscriptionState = { message: null, errors: {} };
	const [state, action] = useFormState(updateSubscription, initialState);

	useEffect(() => {
		if (!state) return;

		const handleStateChange = () => {
			setopen(false);
			toast({
				variant: state.success ? 'default' : 'destructive',
				title: state.success ? 'Success' : 'Error',
				description: state.success
					? 'Become a Supporter Section updated successfully'
					: state.message || 'Failed to update Become a Supporter Section',
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
					<DialogTitle>Update Become a Supporter Section</DialogTitle>
					<DialogDescription>
						{
							"Update Become a Supporter Section. Enter the Become a Supporter details and click save when you're done."
						}
					</DialogDescription>
				</DialogHeader>

				<form className='grid gap-2 ' id='update' action={action}>
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
							Button Text
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
							Button Link
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

					<div className='grid gap-2 items-center'>
						<Label
							htmlFor='footer'
							className={cn(state?.errors?.footer ? 'text-destructive' : '')}
						>
							Footer Text
						</Label>

						<Input
							type='text'
							name='footer'
							id='footer'
							defaultValue={initialData?.footer || undefined}
							className={cn(
								'flex-1',
								state?.errors?.footer
									? 'border-destructive focus-visible:ring-destructive '
									: ''
							)}
						/>

						<ErrorMessage errors={state?.errors?.footer} />
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
			Update Become a Supporter
		</Button>
	);
}

export function EditSubscriptionButton({
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
			<SubscriptionDialog
				open={open}
				setopen={setOpen}
				initialData={data}
				key={open ? 'open' : 'close'}
			/>
		</>
	);
}
