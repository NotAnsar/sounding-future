import React from 'react';
import { Icons } from '../icons/socials';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from '../ui/button';

export default function TermsLinks() {
	return (
		<aside className='space-y-6'>
			<div>
				<h1 className='text-xl font-semibold text-primary-foreground mb-4'>
					Support us
				</h1>
				<Link
					href={'https://www.soundingfuture.com/en/support'}
					target='_blank'
					className={cn(buttonVariants({ variant: 'secondary' }), 'h-8 px-4')}
				>
					Support
				</Link>
			</div>
			<div>
				<h1 className='text-xl font-semibold text-primary-foreground mb-4'>
					Get our monthly newsletter
				</h1>
				<Link
					href={
						'https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=P-1EF321282T362551BMYP6PFQ'
					}
					target='_blank'
					className={cn(buttonVariants({ variant: 'secondary' }), 'h-8 px-4')}
				>
					Subscribe
				</Link>
			</div>
			<div>
				<h1 className='text-xl font-semibold text-primary-foreground mb-4'>
					Find us on social media
				</h1>
				<div className='flex gap-4 items-center'>
					<Link
						href={'https://www.facebook.com/soundingfutureworld'}
						target='_blank'
					>
						<Icons.facebook className='w-8 h-auto aspect-square text-foreground cursor-pointer hover:text-primary-foreground transition-colors duration-200 ease-out' />
					</Link>
					<Link
						href={'https://www.instagram.com/soundingfuture'}
						target='_blank'
					>
						<Icons.instagram className='w-8 h-auto aspect-square text-foreground cursor-pointer hover:text-primary-foreground transition-colors duration-200 ease-out' />
					</Link>
					<Link
						href={'https://www.linkedin.com/company/soundingfuture/'}
						target='_blank'
					>
						<Icons.linkedin className='w-8 h-auto aspect-square text-foreground cursor-pointer hover:text-primary-foreground transition-colors duration-200 ease-out' />
					</Link>
				</div>
			</div>
		</aside>
	);
}
