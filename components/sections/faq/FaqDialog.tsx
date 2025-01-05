'use client';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FAQ } from '@prisma/client';
import { useState } from 'react';
import { createFaq, updateFaq } from '@/actions/sections/faq';
import { toast } from '@/hooks/use-toast';

// Add this function at the top of your component or outside
const isValidUrl = (url: string) => {
	if (!url) return true; // Allow empty strings
	try {
		new URL(url);
		return true;
	} catch {
		return false;
	}
};

interface FaqDialogProps {
	children: React.ReactNode;
	faq?: FAQ;
	onUpdate?: (faq: FAQ) => void;
	onAdd?: (faq: FAQ) => void;
}

export function FaqDialog({ children, faq, onUpdate, onAdd }: FaqDialogProps) {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);

		const formData = new FormData(e.currentTarget);
		const question = formData.get('question') as string;
		const answer = formData.get('answer') as string;
		const link = formData.get('link') as string;

		if (link && !isValidUrl(link)) {
			toast({
				title: 'Invalid URL',
				description: 'Please enter a valid URL for the link field.',
				variant: 'destructive',
			});
			setLoading(false);
			return;
		}

		try {
			if (faq) {
				const updatedFaq = await updateFaq(faq.id, { question, answer, link });
				onUpdate?.(updatedFaq);
				toast({
					title: 'Success',
					description: 'FAQ updated successfully.',
				});
			} else {
				const newFaq = await createFaq({ question, answer, link });
				onAdd?.(newFaq);
				toast({
					title: 'Success',
					description: 'FAQ created successfully.',
				});
			}
			setOpen(false);
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to save FAQ. Please try again.',
				variant: 'destructive',
			});
		}

		setLoading(false);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<span onClick={() => setOpen(true)}>{children}</span>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{faq ? 'Edit FAQ' : 'Add FAQ'}</DialogTitle>
					<DialogDescription>
						{faq
							? 'Edit your frequently asked question and answer.'
							: 'Add a new frequently asked question and answer.'}
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className='space-y-4'>
					<div className='space-y-2'>
						<Label htmlFor='question'>Question</Label>
						<Input
							id='question'
							name='question'
							defaultValue={faq?.question}
							required
						/>
					</div>

					<div className='space-y-2'>
						<Label htmlFor='answer'>Answer</Label>
						<Textarea
							id='answer'
							name='answer'
							defaultValue={faq?.answer}
							required
							rows={5}
						/>
					</div>

					<div className='space-y-2'>
						<Label htmlFor='answer'>Link</Label>
						<Input
							id='link'
							name='link'
							defaultValue={faq?.link || undefined}
						/>
					</div>

					<DialogFooter>
						<Button type='submit' disabled={loading}>
							{loading ? 'Saving...' : faq ? 'Save Changes' : 'Add FAQ'}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
