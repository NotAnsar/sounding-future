'use client';
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
	TermsPageMetadataState,
	updateTermsMetadata,
} from '@/actions/pages/terms-action';

interface UpdateTermsMetadataProps {
	type?: 'terms' | 'privacy';
	field?: 'introduction' | 'footer';
	defaultValue?: string;
}

export function UpdateTermsMetadata({
	type = 'terms',
	field = 'introduction',
	defaultValue,
}: UpdateTermsMetadataProps) {
	const [open, setOpen] = useState(false);
	const initialState: TermsPageMetadataState = {};
	const [state, action] = useFormState(
		async (prevState: TermsPageMetadataState, formData: FormData) => {
			return updateTermsMetadata(type, field, prevState, formData);
		},
		initialState
	);

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

	const fieldTitle = field.charAt(0).toUpperCase() + field.slice(1);

	return (
		<>
			<Button className='cursor-pointer' onClick={() => setOpen(true)}>
				<Edit className='w-4 h-4 mr-2' />
				Edit {fieldTitle}
			</Button>
			<Dialog open={open} onOpenChange={setOpen} key={open ? 'open' : 'close'}>
				<DialogContent className='sm:max-w-[725px]'>
					<DialogHeader>
						<DialogTitle>
							Edit {type} Page {fieldTitle}
						</DialogTitle>
						<DialogDescription>
							Update the {field} for the {type} page.
						</DialogDescription>
					</DialogHeader>

					<form action={action} className='space-y-4'>
						<div className='grid gap-2'>
							<Label htmlFor={field}>{fieldTitle}</Label>
							<Textarea
								id={field}
								name={field}
								rows={4}
								defaultValue={defaultValue || ''}
								className={cn(
									state?.errors?.[field]
										? 'border-destructive focus-visible:ring-destructive'
										: ''
								)}
							/>
							<ErrorMessage errors={state?.errors?.[field]} />
						</div>

						<DialogFooter>
							<PendingButton message={`Update ${fieldTitle}`} />
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
