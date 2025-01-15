import TracksCards from '@/components/tracks/TracksCards';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import TrackList from '@/components/tracks/TrackList';
import HeaderBanner from '@/components/HeaderBanner';
import DynamicNav from '@/components/curated/DynamicNav';
import { getPublicTracks } from '@/db/tracks';
import { generateTracksListingSchema } from '@/schema/tracks-schema';

export async function generateMetadata({
	searchParams: { sort },
}: {
	searchParams: { sort: string };
}) {
	const tracks = await getPublicTracks(
		12,
		sort === 'popular' ? 'popular' : 'new'
	);

	const schema = generateTracksListingSchema(tracks.data);

	return {
		title: 'Sound Tracks - Browse Our Collection',
		description: 'Explore our curated collection of 3D audio tracks',
		openGraph: {
			title: 'Sound Tracks Collection',
			description: 'Browse our collection of 3D audio tracks',
			images: ['/banners/tracks.jpg'],
			type: 'website',
		},
		other: {
			'schema:collection-page': JSON.stringify(schema),
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
	const tracks = await getPublicTracks(12, tabValue);

	return (
		<>
			<script
				type='application/ld+json'
				key='structured-data'
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(generateTracksListingSchema(tracks.data)),
				}}
			/>

			<HeaderBanner img={'/banners/tracks.jpg'} title='Tracks' />

			<Tabs value={tabValue} className='mt-4 sm:mt-8 grid gap-2 sm:gap-3'>
				<DynamicNav type={type} sort={sort} />
				<TabsContent value='new'>
					{isTable ? (
						<TrackList tracks={tracks.data} className='p-0' />
					) : (
						<TracksCards tracks={tracks.data} />
					)}
				</TabsContent>
				<TabsContent value='popular'>
					{isTable ? (
						<TrackList tracks={tracks.data} className='p-0' />
					) : (
						<TracksCards tracks={tracks.data} />
					)}
				</TabsContent>
			</Tabs>
		</>
	);
}
