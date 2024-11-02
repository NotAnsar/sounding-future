import { NEWS_LETTER_LINK } from '@/config/links';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import React from 'react';
import { buttonVariants } from '../ui/button';

export default function NewsLetter() {
	return (
		<div className='space-y-4'>
			<h1 className='text-xl font-semibold text-primary-foreground '>
				Get our monthly newsletter
			</h1>
			<p>
				The Sounding Future newsletter provides monthly updates on new articles,
				hands-on tutorials, open calls and books. We feature artistic or
				technical audio projects. And, of course, new 3D audio tracks.
			</p>
			<Link
				href={NEWS_LETTER_LINK}
				target='_blank'
				className={cn(
					buttonVariants(),
					'w-full sm:w-auto bg-button hover:bg-button '
				)}
			>
				Join our Newsletter
			</Link>
		</div>
	);
}
