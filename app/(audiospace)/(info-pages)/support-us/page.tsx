import NewsLetter from '@/components/termsAndLegal/NewsLetter';
import SocialLinks from '@/components/termsAndLegal/SocialLinks';
import { buttonVariants } from '@/components/ui/button';
import {
	getSupportUsPageData,
	getSupportUsSubscriptions,
} from '@/db/support-us';
import { cn } from '@/lib/utils';
import Link from 'next/link';

import React from 'react';

export default async function page() {
	const [{ data }, { data: pricingPlans }] = await Promise.all([
		getSupportUsPageData(),
		getSupportUsSubscriptions(true),
	]);

	if (!data) return null;

	return (
		<div className='max-w-screen-lg space-y-8'>
			<div className='space-y-5'>
				{data.heading && <h1 className='font-semibold'>{data.heading}</h1>}
				{data.subheading && <p>{data.subheading}</p>}
			</div>

			<div className='grid lg:grid-cols-2 gap-6'>
				{pricingPlans.map((plan, index) => (
					<div
						key={index}
						className={cn(
							'bg-card text-white p-8 rounded-3xl border border-white flex flex-col space-y-4',
							index === 0 && 'dark:bg-secondary bg-secondary-foreground'
						)}
					>
						<h2 className='text-3xl font-semibold'>{plan.name}</h2>
						<p>{plan.description}</p>
						<div>
							<span className='text-3xl font-bold'>
								{plan.priceAmount}
								{plan.priceCurrency}
							</span>{' '}
							{plan.pricePeriod && (
								<>
									/<span className=''>{plan.pricePeriod}</span>
								</>
							)}
						</div>

						<div className='space-y-6'>
							{plan.sections.map((section, index) => (
								<div key={index} className='space-y-2'>
									<h3 className='font-bold text-lg'>{section.title}</h3>
									<ul className='space-y-2'>
										{section.features.map((feature, index) => (
											<li key={index} className='flex items-start text-[15px]'>
												<span className='mr-2'>•</span>
												<span>{feature}</span>
											</li>
										))}
									</ul>
								</div>
							))}
						</div>

						{plan.buttonLink && (
							<div className='pt-4 flex justify-center items-center h-full'>
								<Link
									href={plan.buttonLink}
									target='_blank'
									className={cn(
										buttonVariants({
											size: 'lg',
										}),
										'w-full md:w-auto bg-button hover:bg-button mx-auto text-[15px]'
									)}
								>
									{plan.buttonText || plan.buttonLink}
								</Link>
							</div>
						)}
					</div>
				))}
			</div>

			{data.footer && <p>{data.footer}</p>}

			<NewsLetter />
			<SocialLinks />
		</div>
	);
}
