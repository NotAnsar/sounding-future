import CuratedList from '@/components/curated/CuratedList';
import HeaderBanner from '@/components/HeaderBanner';
import { collections } from '@/config/dummy-data';
import React from 'react';

export default function page() {
	return (
		<>
			<HeaderBanner img={'/banners/curated.jpg'} title='Curated' />
			<CuratedList collections={collections} className='xl:w-2/3 mt-12' />
		</>
	);
}
