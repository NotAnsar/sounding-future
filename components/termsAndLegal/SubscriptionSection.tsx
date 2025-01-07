import React from 'react';
import { ContactUsLink } from './ContactUsButton';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from '../ui/button';
import { getSubscription } from '@/db/section';

export default async function SubscriptionSection() {
	const { data: subscription } = await getSubscription();

	if (!subscription) return null;
	return (
		<div className='space-y-4 rounded-2xl border border-foreground h-fit p-8 '>
			<p>{subscription.content}</p>

			<Link
				href={subscription.link}
				className={cn(
					buttonVariants(),
					'w-full sm:w-auto bg-button hover:bg-button'
				)}
				target='_blank'
			>
				{subscription.label}
			</Link>
			<p className=''>
				{subscription.footer && (
					<>
						{subscription.footer}
						<br />
					</>
				)}
				Please <ContactUsLink /> via the contact form
			</p>
		</div>
	);
}
