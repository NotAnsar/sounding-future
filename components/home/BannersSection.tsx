import React from 'react';
import { buttonVariants } from '../ui/button';
import Link from 'next/link';
import { getBanners } from '@/db/banners';
import Error from '../Error';

export default async function BannersSection() {
	const banners = await getBanners(true);

	if (banners.error) {
		return <Error message={banners.message} />;
	}

	return (
		<div className='col-span-full xl:col-span-1 text-white flex flex-col gap-6'>
			{banners.data.map((banner) => (
				<div
					key={banner.id}
					className='p-6 rounded-3xl space-y-5'
					style={{
						backgroundColor: banner.backgroundColor,
						...(banner.backgroundImage && {
							backgroundImage: `url(${banner.backgroundImage})`,
							backgroundSize: 'cover',
							backgroundPosition: 'center',
							backgroundRepeat: 'no-repeat',
						}),
					}}
				>
					<h2 className='text-4xl font-bold'>{banner.title}</h2>
					<p>{banner.description}</p>
					<Link
						href={banner.link}
						className={`${buttonVariants()} shadow-lg`}
						target='_blank'
					>
						{banner.buttonText}
					</Link>
				</div>
			))}
		</div>
	);
}
