'use client';

import { AboutHeader } from '@prisma/client';
import { useEffect, useState } from 'react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Edit, Loader, Plus } from 'lucide-react';
import { useFormState, useFormStatus } from 'react-dom';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import ErrorMessage from '../../ErrorMessage';

import {
	updateAboutHeader,
	AboutHeaderState,
} from '@/actions/pages/about/about-header';
import { Input } from '@/components/ui/input';

export function EditAboutHeader({ data }: { data?: AboutHeader }) {
	return (
		<header className='bg-player rounded-lg p-6 '>
			<div className='flex items-center justify-between mb-4 font-semibold text-xl'>
				Header Section
				<UpdateHeaderdata defaultValue={data} />
			</div>

			{data ? (
				<p className=' max-w-5xl'>
					<span className='text-primary-foreground hover:underline'>
						{data.websiteName}
					</span>{' '}
					{data.description}
				</p>
			) : (
				<p className='text-muted'>No content available</p>
			)}
		</header>
	);
}

export function UpdateHeaderdata({
	defaultValue,
}: {
	defaultValue?: AboutHeader;
}) {
	const [open, setOpen] = useState(false);
	const initialState: AboutHeaderState = {};
	const [state, action] = useFormState(updateAboutHeader, initialState);

	useEffect(() => {
		if (state?.message && !state.errors) {
			setOpen(false);
			toast({
				variant: state.success ? 'default' : 'destructive',
				title: state.success ? 'Success' : 'Error',
				description: state.message,
			});
		}
	}, [state, setOpen]);

	return (
		<>
			<Button className='cursor-pointer' onClick={() => setOpen(true)}>
				<Edit className='w-4 h-4 mr-2' />
				Edit About Header
			</Button>
			<Dialog open={open} onOpenChange={setOpen} key={open ? 'open' : 'close'}>
				<DialogContent className='sm:max-w-[725px]'>
					<DialogHeader>
						<DialogTitle>Edit About Header</DialogTitle>
						<DialogDescription>
                            Make changes to the About Header section below. Click save when you are done.
						</DialogDescription>
					</DialogHeader>

					<form action={action} className='space-y-4'>
						<div className='grid gap-2'>
							<Label htmlFor={'websiteName'}>Website Name</Label>
							<Input
								id={'websiteName'}
								name={'websiteName'}
								defaultValue={defaultValue?.websiteName || ''}
								className={cn(
									state?.errors?.websiteName
										? 'border-destructive focus-visible:ring-destructive'
										: ''
								)}
							/>
							<ErrorMessage errors={state?.errors?.websiteName} />
						</div>
						<div className='grid gap-2'>
							<Label htmlFor={'websiteUrl'}>Website URL</Label>
							<Input
								id={'websiteUrl'}
								name={'websiteUrl'}
								defaultValue={defaultValue?.websiteUrl || ''}
								className={cn(
									state?.errors?.websiteUrl
										? 'border-destructive focus-visible:ring-destructive'
										: ''
								)}
							/>
							<ErrorMessage errors={state?.errors?.websiteUrl} />
						</div>
						<div className='grid gap-2'>
							<Label htmlFor={'description'}>Description</Label>
							<Textarea
								id={'description'}
								name={'description'}
								rows={6}
								defaultValue={defaultValue?.description || ''}
								className={cn(
									state?.errors?.description
										? 'border-destructive focus-visible:ring-destructive'
										: ''
								)}
							/>
							<ErrorMessage errors={state?.errors?.description} />
						</div>

						<DialogFooter>
							<PendingButton message={`Update About Header`} />
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</>
	);
}

function PendingButton({ message }: { message: string }) {
	const { pending } = useFormStatus();

	return (
		<Button type='submit' aria-disabled={pending} disabled={pending}>
			{pending ? (
				<Loader className='mr-2 h-4 w-4 animate-spin' />
			) : (
				<Plus className='mr-2 h-4 w-4' />
			)}
			{message}
		</Button>
	);
}
