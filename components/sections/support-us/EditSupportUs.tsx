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
import { PricingPage } from '@prisma/client';
import ErrorMessage from '../../ErrorMessage';
import { SupportUsState, updateSupportUs } from '@/actions/sections/support-us';
import { Textarea } from '../../ui/textarea';

export function EditSupportUsDialog({
	open,
	setopen,
	initialData,
}: {
	initialData?: PricingPage;
	open: boolean;
	setopen: Dispatch<SetStateAction<boolean>>;
}) {
	const initialState: SupportUsState = { message: null, errors: {} };
	const [state, action] = useFormState(updateSupportUs, initialState);

	useEffect(() => {
		if (!state) return;

		const handleStateChange = () => {
			setopen(false);
			toast({
				variant: state.success ? 'default' : 'destructive',
				title: state.success ? 'Success' : 'Error',
				description: state.success
					? 'Support Us Section Updated Successfully'
					: state.message || 'Failed to update Support Us Section',
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
					<DialogTitle>Update Support Us Section</DialogTitle>
					<DialogDescription>
						{
							"Update the heading, subheading, and footer text for the 'Support Us' section."
						}
					</DialogDescription>
				</DialogHeader>

				<form className='grid gap-2 ' id='update' action={action}>
					<div className='grid gap-2 items-center'>
						<Label
							htmlFor='heading'
							className={cn(state?.errors?.heading ? 'text-destructive' : '')}
						>
							Heading
						</Label>

						<Input
							type='text'
							name='heading'
							id='heading'
							defaultValue={initialData?.heading || undefined}
							className={cn(
								'flex-1',
								state?.errors?.heading
									? 'border-destructive focus-visible:ring-destructive '
									: ''
							)}
						/>

						<ErrorMessage errors={state?.errors?.heading} />
					</div>

					<div className='grid gap-2 items-center'>
						<Label
							htmlFor='subheading'
							className={cn(
								state?.errors?.subheading ? 'text-destructive' : ''
							)}
						>
							Subheading
						</Label>

						<Textarea
							name='subheading'
							id='subheading'
							defaultValue={initialData?.subheading || undefined}
							className={cn(
								'flex-1',
								state?.errors?.subheading
									? 'border-destructive focus-visible:ring-destructive '
									: ''
							)}
							rows={6}
						/>

						<ErrorMessage errors={state?.errors?.subheading} />
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
			Update Support Us Section
		</Button>
	);
}

export function EditSupportUsPage({
	data,
	children,
}: {
	data?: PricingPage;
	children: React.ReactNode;
}) {
	const [open, setOpen] = useState(false);

	return (
		<>
			<span className='cursor-pointer' onClick={() => setOpen(true)}>
				{children}
			</span>
			<EditSupportUsDialog
				open={open}
				setopen={setOpen}
				initialData={data}
				key={open ? 'open' : 'close'}
			/>
		</>
	);
}
