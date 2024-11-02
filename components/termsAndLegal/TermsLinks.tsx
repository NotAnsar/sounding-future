import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from '../ui/button';
import SocialLinks from './SocialLinks';

export default function TermsLinks({ className }: { className?: string }) {
	return (
		<aside className={cn('space-y-6', className)}>
			<div>
				<h1 className='text-xl font-semibold text-primary-foreground mb-4'>
					Support us
				</h1>
				<Link
					href={'/support-us'}
					className={cn(buttonVariants({ variant: 'secondary' }), 'h-8 px-4')}
				>
					Support
				</Link>
			</div>

			<SocialLinks />
		</aside>
	);
}
