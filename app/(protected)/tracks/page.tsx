import TracksCards from '@/components/tracks/TracksCards';
import TracksNav from '@/components/tracks/TracksNav';
import { TabsContent } from '@/components/ui/tabs';
import { tracks } from '../page';

export default function page({
	searchParams: { type },
}: {
	searchParams: { type: string };
}) {
	return (
		<>
			<TracksNav type={type} />
			<TabsContent value='new'>
				<TracksCards tracks={[...tracks, ...tracks, ...tracks, ...tracks]} />
			</TabsContent>
		</>
	);
}
