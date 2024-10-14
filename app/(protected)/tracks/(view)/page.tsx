import TracksCards from '@/components/tracks/TracksCards';
import TracksNav from '@/components/tracks/TracksNav';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import TrackList from '@/components/tracks/TrackList';
import { tracks } from '@/config/dummy-data';
import HeaderBanner from '@/components/HeaderBanner';

export default function page({
	searchParams: { type, sort },
}: {
	searchParams: { type: string; sort: string };
}) {
	const isTable = type === 'table';
	const tabValue = sort === 'popular' || sort === 'curated' ? sort : 'new';

	return (
		<>
			<HeaderBanner img={'/tracks.png'} title='Tracks' />
			<Tabs value={tabValue} className='mt-4 sm:mt-8 grid gap-2 sm:gap-3'>
				<TracksNav type={type} sort={sort} />
				<TabsContent value='new'>
					{isTable ? (
						<TrackList tracks={tracks} className='p-0' />
					) : (
						<TracksCards tracks={tracks} />
					)}
				</TabsContent>
				<TabsContent value='popular'>
					{/* <h1 className='text-3xl mb-4 font-medium'>Popular</h1> */}
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
