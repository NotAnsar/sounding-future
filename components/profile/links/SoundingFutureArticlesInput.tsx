'use client';
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import ErrorMessage from '@/components/ErrorMessage';
import { PlusCircle, X } from 'lucide-react';

export default function SoundingFutureArticlesInput({
	errors,
}: {
	errors?: string[];
}) {
	const [articleLinks, setArticleLinks] = useState<string[]>(['']);

	const addArticleLink = () => {
		if (articleLinks.length < 10) {
			setArticleLinks([...articleLinks, '']);
		}
	};

	const removeArticleLink = (index: number) => {
		const newLinks = articleLinks.filter((_, i) => i !== index);
		setArticleLinks(newLinks);
	};

	const updateArticleLink = (index: number, value: string) => {
		const newLinks = [...articleLinks];
		newLinks[index] = value;
		setArticleLinks(newLinks);
	};

	return (
		<div className='grid gap-2'>
			<Label
				htmlFor='soundingFutureArticles'
				className={cn(errors ? 'text-destructive' : '')}
			>
				Sounding Future article links
			</Label>
			{articleLinks.map((link, index) => (
				<div key={index} className='flex items-center gap-2'>
					<Input
						type='text'
						name='soundingFutureArticles'
						placeholder='http://'
						value={link}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							updateArticleLink(index, e.target.value)
						}
						className={cn(
							'flex-grow max-w-lg',
							errors ? 'border-destructive focus-visible:ring-destructive' : ''
						)}
					/>
					{index >= 0 && index !== articleLinks.length - 1 && (
						<Button
							type='button'
							variant='outline'
							size='icon'
							onClick={() => removeArticleLink(index)}
						>
							<X className='h-4 w-4' />
						</Button>
					)}
					{index === articleLinks.length - 1 && articleLinks.length < 10 && (
						<Button
							type='button'
							variant='outline'
							size='icon'
							onClick={addArticleLink}
						>
							<PlusCircle className='h-4 w-4' />
						</Button>
					)}
				</div>
			))}
			<p className='text-muted-foreground text-sm'>
				Link your Sounding Future articles (up to 10)
			</p>
			<ErrorMessage errors={errors} />
		</div>
	);
}
