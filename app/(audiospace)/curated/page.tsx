import CuratedList from '@/components/curated/CuratedList';
import HeaderBanner from '@/components/HeaderBanner';
import { getPartners } from '@/db/partner';
import React from 'react';

export default async function page() {
	const partners = await getPartners();
	return (
		<>
			<HeaderBanner img={'/banners/curated.jpg'} title='Curated' />
			<CuratedList partners={partners} className='mt-12' />
		</>
	);
}
