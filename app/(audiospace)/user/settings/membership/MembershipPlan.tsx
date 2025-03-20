import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import React from 'react';

export default function MembershipPlan({ isPro }: { isPro: boolean }) {
	return (
		<div>
			<h2 className='text-xl font-semibold mb-4'>Membership Plan</h2>
			<div className='flex gap-4 mb-3'>
				<div
					className={cn(
						'flex-1 p-5 border rounded-lg relative flex flex-col justify-center',
						!isPro && 'border-primary border-2'
					)}
				>
					{!isPro && (
						<span className='absolute -top-2 left-4 px-2 py-0.5 text-xs font-medium bg-background border border-primary text-primary rounded-sm'>
							Current
						</span>
					)}
					<h3 className='text-base font-medium text-center'>Free</h3>
				</div>

				<div
					className={cn(
						'flex-1 p-5 border rounded-lg relative flex flex-col',
						isPro && 'border-primary border-2'
					)}
				>
					{isPro ? (
						<span className='absolute -top-2 left-4 px-2 py-0.5 text-xs font-medium bg-background border border-primary text-primary rounded-sm'>
							Current
						</span>
					) : (
						<span className='absolute -top-2 right-4 px-2 py-0.5 text-xs font-medium bg-background border border-primary text-primary rounded-sm'>
							Recommended
						</span>
					)}
					<h3 className='text-base font-medium text-center'>Pro</h3>
					{!isPro && (
						<Link
							className={cn(buttonVariants({ size: 'sm' }), 'w-full mt-4')}
							href={'https://buy.stripe.com/9AQ4id4eB05P8OkcMM'}
							target='_blank'
						>
							Upgrade
						</Link>
					)}
				</div>
			</div>

			{!isPro && (
				<div className='mt-6'>
					<p className='mb-3'>
						Learn more how you can support us as Pro user and get advanced
						platform features.
					</p>
					<Link
						className={cn(buttonVariants(), 'font-semibold')}
						href='/support-us'
						target='_blank'
					>
						Support Us
					</Link>
				</div>
			)}
		</div>
	);
}
