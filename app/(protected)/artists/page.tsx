import ExploreArtists from '@/components/artists/ExploreArtists';
import HeaderBanner from '@/components/HeaderBanner';
import React from 'react';

export default function page() {
	return (
		<>
			<HeaderBanner img={'/artists.png'} title='Artists' />
			<ExploreArtists className='xl:w-2/3 mt-12' />
		</>
	);
}
