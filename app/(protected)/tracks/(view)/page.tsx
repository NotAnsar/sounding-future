import TracksCards from '@/components/tracks/TracksCards';
import TracksNav from '@/components/tracks/TracksNav';
import { TabsContent } from '@/components/ui/tabs';

import TrackList from '@/components/tracks/TrackList';
import { tracks } from '../../page';

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
					<TrackList tracks={tracks} className='p-0' />
				) : (
					<TracksCards tracks={tracks} />
				)}
			</TabsContent>
		</>
	);
}
