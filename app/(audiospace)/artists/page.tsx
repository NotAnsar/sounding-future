import ExploreArtists from '@/components/artists/ExploreArtists';
import HeaderBanner from '@/components/HeaderBanner';
import React from 'react';
import ArtistList from '@/components/artists/ArtistList';
import { getArtistsList } from '@/db/artist';
import Error from '@/components/Error';
import { generateArtistsListingSchema } from '@/schema/artists-schema';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import DynamicNav from '@/components/curated/DynamicNav';

export async function generateMetadata() {
	const artists = await getArtistsList();

	if (artists.error) {
		return { title: 'Artists Not Found' };
	}

	return {
		title: 'Artists - Explore Our Audio Collection',
		description: 'Browse our collection of innovative audio artists',
		openGraph: {
			title: 'Artists - Explore Our Audio Collection',
			description: 'Browse our collection of innovative audio artists',
			images: ['/banners/artists.jpg'],
			type: 'website',
		},
		other: {
			'schema:collection-page': JSON.stringify(
				generateArtistsListingSchema(artists.data)
			),
		},
	};
}

export default async function page({
	searchParams: { type, sort },
}: {
	searchParams: { type: string; sort: string };
}) {
	const isTable = type === 'table';
	const tabValue = sort === 'popular' ? 'popular' : 'new';
	const artists = await getArtistsList(undefined, tabValue);

	if (artists.error) {
		return <Error message={artists.message} />;
	}

	return (
		<>
			<script
				type='application/ld+json'
				key='structured-data'
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(generateArtistsListingSchema(artists.data)),
				}}
			/>

			<HeaderBanner img={'/banners/artists.jpg'} title='Artists' />

			<Tabs value={tabValue} className='mt-4 sm:mt-8 grid gap-2 sm:gap-3'>
				<DynamicNav type={type} sort={sort} label='Artists' />
				<TabsContent value='new' className='xl:w-2/3'>
					{isTable ? (
						<ArtistList artists={artists.data} />
					) : (
						<ExploreArtists artists={artists.data} />
					)}
				</TabsContent>
				<TabsContent value='popular' className='xl:w-2/3'>
					{isTable ? (
						<ArtistList artists={artists.data} />
					) : (
						<ExploreArtists artists={artists.data} />
					)}
				</TabsContent>
			</Tabs>
		</>
	);
}
