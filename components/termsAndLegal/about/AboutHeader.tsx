import { getAboutHeader } from '@/db/about';
import Link from 'next/link';
import React from 'react';

export default async function AboutHeader() {
	const { data } = await getAboutHeader();

	if (!data) {
		return null;
	}

	return (
		<header className='space-y-2'>
			<p className=' max-w-5xl'>
				<Link
					href={data.websiteUrl}
					target='_blank'
					className='text-primary-foreground hover:underline'
				>
					{data.websiteName}
				</Link>{' '}
				{data.description}
			</p>
		</header>
	);
}
