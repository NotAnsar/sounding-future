import CuratedList from '@/components/curated/CuratedList';
import Error from '@/components/Error';
import HeaderBanner from '@/components/HeaderBanner';
import { getPartners } from '@/db/partner';
import React from 'react';

export default async function page() {
	const partners = await getPartners();

	if (partners.error) {
		return <Error message={partners.message} />;
	}

	return (
		<>
			<HeaderBanner img={'/banners/curated.jpg'} title='Curated' />
			<CuratedList partners={partners.data} className='mt-12' />
		</>
	);
}
