import { ContactUsLink } from '@/components/termsAndLegal/ContactUsButton';
import NewsLetter from '@/components/termsAndLegal/NewsLetter';
import SocialLinks from '@/components/termsAndLegal/SocialLinks';
import SubscriptionCard from '@/components/termsAndLegal/support-us/SubscriptionCard';
import { buttonVariants } from '@/components/ui/button';
import { SUBSCRIBE_LINK } from '@/config/links';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import React from 'react';

export default function page() {
	return (
		<div className='grid xl:grid-cols-3 gap-6 '>
			<div className='md:col-span-2 max-w-2xl space-y-6 mt-4'>
				<SubscriptionCard />
				<NewsLetter />
				<SocialLinks />
			</div>
			<div className='space-y-4 rounded-2xl border border-foreground h-fit p-8 '>
				<p>You can pay your subscription via Paypal:</p>

				<Link
					href={SUBSCRIBE_LINK}
					className={cn(
						buttonVariants(),
						'w-full sm:w-auto bg-button hover:bg-button'
					)}
					target='_blank'
				>
					Become a Supporter
				</Link>
				<p className=''>
					Or of course by bank transfer.
					<br />
					Please <ContactUsLink /> via the contact form
				</p>
			</div>
		</div>
	);
}
