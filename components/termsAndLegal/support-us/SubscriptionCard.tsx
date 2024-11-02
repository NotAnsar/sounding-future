import React from 'react';
import { Icons } from '@/components/icons/legal-icons';

export default function SubscriptionCard() {
	return (
		<div className='bg-card text-white p-8 rounded-3xl max-w-2xl'>
			<div className='space-y-8 '>
				<div className='flex gap-4 items-start'>
					<Icons.donate className='w-9 h-auto aspect-square fill-white mt-3' />

					<div className='space-y-2'>
						<h1 className='text-3xl font-semibold'>Sounding Future</h1>
						<h2 className='text-xl font-medium'>Support subscription</h2>
						<div className='mt-4'>
							<span className='text-3xl font-bold'>29€/year</span>
						</div>
					</div>
				</div>

				<div className='text-left mx-auto space-y-4'>
					<h3 className='text-xl font-medium'>
						6 reasons for the support subscription:
					</h3>
					<ul className='space-y-4'>
						<li className='flex items-start'>
							<span className='mr-2'>•</span>
							<span>
								Your contribution enables us to provide free access to all
								articles or audio tracks.
							</span>
						</li>
						<li className='flex items-start'>
							<span className='mr-2'>•</span>
							<span>
								With your help, we offer useful tips and book recommendations.
							</span>
						</li>
						<li className='flex items-start'>
							<span className='mr-2'>•</span>
							<span>With your help, we improve the community functions.</span>
						</li>
						<li className='flex items-start'>
							<span className='mr-2'>•</span>
							<span>
								With your subscription, we finance our informative monthly
								newsletter.
							</span>
						</li>
						<li className='flex items-start'>
							<span className='mr-2'>•</span>
							<span>
								You support the discovery and promotion of new authors.
							</span>
						</li>
						<li className='flex items-start'>
							<span className='mr-2'>•</span>
							<span>
								Your contribution helps us to develop new and exciting features
								for the platform.
							</span>
						</li>
					</ul>
				</div>

				<p className='text-sm'>Thank you for your support!</p>
			</div>
		</div>
	);
}
