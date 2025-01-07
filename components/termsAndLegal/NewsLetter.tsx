import { cn } from '@/lib/utils';
import Link from 'next/link';
import React from 'react';
import { buttonVariants } from '../ui/button';
import { getNewsLetter } from '@/db/section';

export default async function NewsLetter() {
	const { data: newsletter } = await getNewsLetter();

	if (!newsletter) return null;

	return (
		<div className='space-y-4'>
			<h1 className='text-xl font-semibold text-primary-foreground '>
				{newsletter.title}
			</h1>
			<p>{newsletter.content}</p>
			<Link
				href={newsletter.link}
				target='_blank'
				className={cn(
					buttonVariants(),
					'w-full sm:w-auto bg-button hover:bg-button '
				)}
			>
				{newsletter.label}
			</Link>
		</div>
	);
}
