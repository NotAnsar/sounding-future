'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { ContactState, submitContact } from '@/actions/contact-action';
import ErrorMessage from '../ErrorMessage';
import { Label } from '../ui/label';

const initialState: ContactState = {
	message: null,
	errors: {},
};

export default function ContactDialog({
	children,
}: {
	children: React.ReactNode;
}) {
	const [open, setopen] = useState(false);
	const formRef = useRef<HTMLFormElement>(null);
	const [state, formAction] = useFormState(submitContact, initialState);

	useEffect(() => {
		if (state.message) {
			toast({
				description: state.message,
				title: state?.success ? 'Success' : 'Error',
				variant: state?.success ? 'default' : 'destructive',
				duration: 5000,
			});

			if (formRef.current && state.success) {
				formRef.current.reset();
				setopen(false);
			}
		}
	}, [state, setopen]);

	return (
		<Dialog open={open} onOpenChange={setopen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className='sm:max-w-xl bg-[#1B273D] text-white border-transparent'>
				<DialogHeader className='relative'>
					<DialogTitle className='text-3xl font-semibold'>Contact</DialogTitle>
				</DialogHeader>

				<form ref={formRef} action={formAction} className='space-y-4 '>
					<div className='space-y-1.5'>
						<Label htmlFor='subject'>Subject</Label>
						<Input
							name='subject'
							placeholder='Subject'
							className={cn(
								'text-foreground bg-[#141B29] text-white border-[#141B29]',
								state.errors?.subject && 'border-destructive'
							)}
							required
						/>
						{state.errors?.subject && (
							<ErrorMessage errors={state.errors?.subject} />
						)}
					</div>

					<div className='grid grid-cols-2 gap-3'>
						<div className='space-y-1.5'>
							<Label htmlFor='firstName'>First Name</Label>
							<Input
								name='firstName'
								placeholder='John'
								className={cn(
									'text-foreground bg-[#141B29] text-white border-[#141B29]',
									state.errors?.firstName && 'border-destructive'
								)}
								required
							/>
							{state.errors?.firstName && (
								<ErrorMessage errors={state.errors?.firstName} />
							)}
						</div>
						<div className='space-y-1.5'>
							<Label htmlFor='lastName'>Last Name</Label>
							<Input
								name='lastName'
								placeholder='Doe'
								className={cn(
									'text-foreground bg-[#141B29] text-white border-[#141B29]',
									state.errors?.lastName && 'border-destructive'
								)}
								required
							/>
							{state.errors?.lastName && (
								<ErrorMessage errors={state.errors?.lastName} />
							)}
						</div>
					</div>

					<div className='space-y-1.5'>
						<Label htmlFor='email'>Email</Label>
						<Input
							name='email'
							type='email'
							placeholder='E-Mail'
							className={cn(
								'text-foreground bg-[#141B29] text-white border-[#141B29]',
								state.errors?.email && 'border-destructive'
							)}
							required
						/>
						{state.errors?.email && (
							<ErrorMessage errors={state.errors?.email} />
						)}
					</div>

					<div className='space-y-1.5'>
						<Label htmlFor='message'>Message</Label>
						<Textarea
							name='message'
							placeholder='Message'
							className={cn(
								'text-foreground bg-[#141B29] text-white border-[#141B29]',
								' min-h-[150px]',
								state.errors?.message && 'border-destructive'
							)}
							required
						/>

						{state.errors?.message && (
							<ErrorMessage errors={state.errors?.message} />
						)}
					</div>

					<SubmitButton />
				</form>
			</DialogContent>
		</Dialog>
	);
}

function SubmitButton() {
	const { pending } = useFormStatus();

	return (
		<Button
			type='submit'
			disabled={pending}
			className='text-white flex items-center justify-center gap-2'
		>
			{pending ? (
				<Loader className='h-4 w-4 animate-spin' />
			) : (
				<Send className='h-4 w-4' />
			)}
			Submit message
		</Button>
	);
}
