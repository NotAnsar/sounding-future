import { notFound } from 'next/navigation';
import { collections, tracks } from '@/config/dummy-data';
import CuratedDetails from '@/components/curated/CuratedDetails';
import TrackList from '@/components/tracks/TrackList';
import TracksCards from '@/components/tracks/TracksCards';
import { Tabs } from '@radix-ui/react-tabs';
import { TabsContent } from '@/components/ui/tabs';
import CuratedNav from '@/components/curated/CuratedNav';

export default function page({
	params: { id },
	searchParams: { sort, type },
}: {
	params: { id: string };
	searchParams: { sort: string; type: string };
}) {
	const tabValue = sort === 'popular' ? 'popular' : 'new';
	const isTable = type === 'table';
	const curated = collections.find((a) => {
		return a.id === id;
	});

	if (!curated) {
		notFound();
	}

	const filteredTracks = tracks.filter((t) => t.collection.id === curated.id);
	return (
		<>
			<CuratedDetails curated={curated} />

			<Tabs value={tabValue} className='mt-4 sm:mt-6 grid gap-2 '>
				<CuratedNav type={type} sort={sort} id={id} />

				<h1
					className={
						'text-xl md:text-[22px] font-semibold text-primary-foreground mt-4 '
					}
				>
					These tracks have been compiled by Audiomatch
				</h1>
				<TabsContent value='new'>
					{isTable ? (
						<TrackList tracks={filteredTracks} className='p-0' />
					) : (
						<TracksCards tracks={filteredTracks} />
					)}
				</TabsContent>
				<TabsContent value='popular'>
					{isTable ? (
						<TrackList tracks={filteredTracks} className='p-0' />
					) : (
						<TracksCards tracks={filteredTracks} />
					)}
				</TabsContent>
			</Tabs>
		</>
	);
}
