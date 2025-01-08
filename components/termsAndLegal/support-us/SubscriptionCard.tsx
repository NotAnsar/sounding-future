import React from 'react';
import { Icons } from '@/components/icons/legal-icons';
import { getSubscriptionCard } from '@/db/pages';

export default async function SubscriptionCard() {
	const { data } = await getSubscriptionCard();

	if (!data) {
		return null;
	}

	return (
		<div className='bg-card text-white p-8 rounded-3xl max-w-2xl'>
			<div className='space-y-8 '>
				<div className='flex gap-4 items-start'>
					<Icons.donate className='w-9 h-auto aspect-square fill-white mt-3' />

					<div className='space-y-2'>
						<h1 className='text-3xl font-semibold'>{data.title}</h1>
						<h2 className='text-xl font-medium'>{data.subtitle}</h2>
						<div className='mt-4'>
							<span className='text-3xl font-bold'>{data.priceInfo}</span>
						</div>
					</div>
				</div>

				<div className='text-left mx-auto space-y-4'>
					<h3 className='text-xl font-medium'>{data.reasonsTitle}</h3>
					<ul className='space-y-4'>
						{data.reasons.map((reason, index) => (
							<li key={index} className='flex items-start'>
								<span className='mr-2'>•</span>
								<span>{reason}</span>
							</li>
						))}
					</ul>
				</div>

				<p className='text-sm'>{data.footer}</p>
			</div>
		</div>
	);
}
