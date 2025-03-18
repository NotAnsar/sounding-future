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
							/<span className=''>{plan.pricePeriod}</span>
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

// interface Feature {
// 	text: string;
// }

// interface Plan {
// 	name: string;
// 	description: string;
// 	price: {
// 		amount: number;
// 		currency: string;
// 		period: string;
// 	};

// 	sections: {
// 		title: string;
// 		features: Feature[];
// 	}[];
// 	button?: {
// 		text: string;
// 		link: string;
// 	};
// 	additionalInfo?: string;
// }

// const pricingPlans: Plan[] = [
// 	{
// 		name: 'Free',
// 		description:
// 			'The regular plan for registered users already includes a wide range of features.',
// 		price: {
// 			amount: 0,
// 			currency: '€',
// 			period: 'year',
// 		},
// 		sections: [
// 			{
// 				title: 'In the 3D AudioSpace:',
// 				features: [
// 					{ text: 'Free access to 3D tracks' },
// 					{ text: 'Use Share / Follow / Link features' },
// 					{ text: 'Upload up to 3 showcase tracks' },
// 					{ text: 'We handle the track renderings' },
// 					{ text: 'Add bio and track info' },
// 					{ text: 'We actively promote your music' },
// 				],
// 			},
// 			{
// 				title: 'On the Main Page:',
// 				features: [
// 					{ text: 'Free access to all articles (EN/DE)' },
// 					{ text: 'Free access to book tips and collector' },
// 					{ text: 'Write articles on the platform' },
// 					{ text: 'We edit & translate your article' },
// 					{ text: 'We actively promote your article' },
// 				],
// 			},
// 		],
// 	},
// 	{
// 		name: 'Pro',
// 		description:
// 			'Become a Sounding Future supporter and unlock advanced features.',
// 		price: {
// 			amount: 45,
// 			currency: '€',
// 			period: 'year',
// 		},
// 		sections: [
// 			{
// 				title: 'Includes everything from the Free Plan',
// 				features: [
// 					{ text: 'Upload up to 20 tracks' },
// 					{ text: 'Coming: sell your tracks & merch' },
// 				],
// 			},
// 			{
// 				title: 'Your Support Makes a Difference:',
// 				features: [
// 					{ text: 'Discovery & promotion of new authors/artists' },
// 					{
// 						text: 'Development of dynamic streaming with head-tracking and multichannel streaming and much more',
// 					},
// 				],
// 			},
// 		],
// 		button: {
// 			link: 'https://buy.stripe.com/9AQ4id4eB05P8OkcMM',
// 			text: 'Support us',
// 		},
// 	},
// ];
