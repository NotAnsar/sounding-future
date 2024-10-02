import TracksCards from '@/components/tracks/TracksCards';
import TracksNav from '@/components/tracks/TracksNav';
import { TabsContent } from '@/components/ui/tabs';
import { tracks } from '../page';
import TrackList from '@/components/tracks/TrackList';

export default function page({
	searchParams: { type },
}: {
	searchParams: { type: string };
}) {
	const isTable = type === 'table';
	return (
		<>
			<TracksNav type={type} />
			<TabsContent value='new'>
				{isTable ? (
					<TrackList
						tracks={[...tracks, ...tracks, ...tracks, ...tracks]}
						className='p-0'
					/>
				) : (
					<TracksCards tracks={[...tracks, ...tracks, ...tracks, ...tracks]} />
				)}
			</TabsContent>
		</>
	);
}
