'use client';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader, Plus, X } from 'lucide-react';
import { useFormState, useFormStatus } from 'react-dom';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import ErrorMessage from '../ErrorMessage';
import {
	TermsSectionState,
	createTermsSection,
	updateTermsSection,
} from '@/actions/pages/terms-action';
import { usePathname } from 'next/navigation';

interface TermsSection {
	id: string;
	title: string;
	content: string;
	items: string[];
	footer?: string | null;
}

const TermsSectionDialog = ({
	open,
	setOpen,
	initialData,
	mode = 'create',
}: {
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
	initialData?: TermsSection;
	mode?: 'create' | 'edit';
}) => {
	const path = usePathname();
	const [items, setItems] = useState<string[]>(initialData?.items || []);
	const initialState: TermsSectionState = {};
	const [state, action] = useFormState(
		mode === 'create'
			? (prevState: TermsSectionState, formData: FormData) =>
					createTermsSection(
						path.split('/').includes('privacy') ? 'privacy' : 'terms',
						prevState,
						formData
					)
			: (prevState: TermsSectionState, formData: FormData) =>
					updateTermsSection(initialData?.id || '', prevState, formData),
		initialState
	);

	useEffect(() => {
		if (!state) return;

		if (state.message && !state.errors) {
			setOpen(false);

			toast({
				variant: state.success ? 'default' : 'destructive',
				title: state.success ? 'Success' : 'Error',
				description: state.message,
			});
		}
	}, [state, setOpen]);

	const addItem = () => {
		setItems([...items, '']);
	};

	const removeItem = (index: number) => {
		setItems(items.filter((_, i) => i !== index));
	};

	const updateItem = (index: number, value: string) => {
		const newItems = [...items];
		newItems[index] = value;
		setItems(newItems);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className='sm:max-w-[725px]'>
				<DialogHeader>
					<DialogTitle>
						{mode === 'create' ? 'Create Terms Section' : 'Edit Terms Section'}
					</DialogTitle>
					<DialogDescription>
						{mode === 'create'
							? 'Create a new terms section with title, content, and optional items and footer.'
							: 'Edit the terms section details below.'}
					</DialogDescription>
				</DialogHeader>

				<form className='grid gap-4' id='terms-section-form' action={action}>
					<div className='grid gap-2'>
						<Label
							htmlFor='title'
							className={cn(state?.errors?.title ? 'text-destructive' : '')}
						>
							Title
						</Label>
						<Input
							id='title'
							name='title'
							defaultValue={initialData?.title}
							className={cn(
								state?.errors?.title
									? 'border-destructive focus-visible:ring-destructive'
									: ''
							)}
						/>
						<ErrorMessage errors={state?.errors?.title} />
					</div>

					<div className='grid gap-2'>
						<Label
							htmlFor='content'
							className={cn(state?.errors?.content ? 'text-destructive' : '')}
						>
							Content
						</Label>
						<Textarea
							id='content'
							name='content'
							rows={4}
							defaultValue={initialData?.content}
							className={cn(
								state?.errors?.content
									? 'border-destructive focus-visible:ring-destructive'
									: ''
							)}
						/>
						<ErrorMessage errors={state?.errors?.content} />
					</div>

					<div className='grid gap-2'>
						<Label
							className={cn(state?.errors?.items ? 'text-destructive' : '')}
						>
							Items
						</Label>
						{items.map((item, index) => (
							<div key={index} className='flex gap-2'>
								<Input
									name='items'
									value={item}
									onChange={(e) => updateItem(index, e.target.value)}
									className={cn(
										state?.errors?.items
											? 'border-destructive focus-visible:ring-destructive'
											: ''
									)}
								/>
								<Button
									type='button'
									variant='outline'
									size='icon'
									onClick={() => removeItem(index)}
									className='shrink-0'
								>
									<X className='h-4 w-4' />
								</Button>
							</div>
						))}
						<Button type='button' variant='outline' onClick={addItem}>
							Add Item
						</Button>
						<ErrorMessage errors={state?.errors?.items} />
					</div>

					<div className='grid gap-2'>
						<Label
							htmlFor='footer'
							className={cn(state?.errors?.footer ? 'text-destructive' : '')}
						>
							Footer (Optional)
						</Label>
						<Textarea
							id='footer'
							name='footer'
							rows={2}
							defaultValue={initialData?.footer || ''}
							className={cn(
								state?.errors?.footer
									? 'border-destructive focus-visible:ring-destructive'
									: ''
							)}
						/>
						<ErrorMessage errors={state?.errors?.footer} />
					</div>

					<DialogFooter>
						{state?.message && !state.errors && (
							<p className='text-sm font-medium text-destructive mr-auto'>
								{state.message}
							</p>
						)}
						<PendingButton mode={mode} />
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default TermsSectionDialog;

function PendingButton({ mode }: { mode: 'create' | 'edit' }) {
	const { pending } = useFormStatus();

	return (
		<Button type='submit' aria-disabled={pending} disabled={pending}>
			{pending ? (
				<Loader className='mr-2 h-4 w-4 animate-spin' />
			) : (
				<Plus className='mr-2 h-4 w-4' />
			)}
			{mode === 'create' ? 'Create Section' : 'Update Section'}
		</Button>
	);
}

export function CreateTermsSection() {
	const [open, setOpen] = useState(false);

	return (
		<>
			<Button className='cursor-pointer' onClick={() => setOpen(true)}>
				<Plus className='w-4 h-4 mr-2' />
				Add Section
			</Button>
			<TermsSectionDialog
				open={open}
				setOpen={setOpen}
				mode='create'
				key={open ? 'open' : 'close'}
			/>
		</>
	);
}

export function EditTermsSection({
	data,
	children,
}: {
	data: TermsSection;
	children: React.ReactNode;
}) {
	const [open, setOpen] = useState(false);

	return (
		<>
			<span className='cursor-pointer' onClick={() => setOpen(true)}>
				{children}
			</span>
			<TermsSectionDialog
				open={open}
				setOpen={setOpen}
				initialData={data}
				mode='edit'
				key={open ? 'open' : 'close'}
			/>
		</>
	);
}
