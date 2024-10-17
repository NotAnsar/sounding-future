import ExploreArtists from '@/components/artists/ExploreArtists';
import HeaderBanner from '@/components/HeaderBanner';
import React from 'react';
import { artists } from '@/config/dummy-data';

export default function page() {
	return (
		<>
			<HeaderBanner img={'/banners/artists.jpg'} title='Artists' />
			<ExploreArtists className='xl:w-2/3 mt-12' artists={artists} />
		</>
	);
}
