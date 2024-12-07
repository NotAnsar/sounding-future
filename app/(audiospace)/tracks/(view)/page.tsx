import TracksCards from '@/components/tracks/TracksCards';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import TrackList from '@/components/tracks/TrackList';
import HeaderBanner from '@/components/HeaderBanner';
import DynamicNav from '@/components/curated/DynamicNav';
import { getPublicTracks } from '@/db/tracks';

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
			<HeaderBanner img={'/banners/tracks.jpg'} title='Tracks' />
			<Tabs value={tabValue} className='mt-4 sm:mt-8 grid gap-2 sm:gap-3'>
				<DynamicNav type={type} sort={sort} />
				<TabsContent value='new'>
					{isTable ? (
						<TrackList tracks={tracks} className='p-0' />
					) : (
						<TracksCards tracks={tracks} />
					)}
				</TabsContent>
				<TabsContent value='popular'>
					{isTable ? (
						<TrackList tracks={tracks} className='p-0' />
					) : (
						<TracksCards tracks={tracks} />
					)}
				</TabsContent>
			</Tabs>
		</>
	);
}
