import { notFound } from 'next/navigation';
import CuratedDetails from '@/components/curated/CuratedDetails';
import TrackList from '@/components/tracks/TrackList';
import TracksCards from '@/components/tracks/TracksCards';
import { Tabs } from '@radix-ui/react-tabs';
import { TabsContent } from '@/components/ui/tabs';
import DynamicNav from '@/components/curated/DynamicNav';
import { getPartnerDetailsById } from '@/db/partner';
import { getPublicTracksByPartner } from '@/db/tracks';

export default async function page({
	params: { id },
	searchParams: { sort, type },
}: {
	params: { id: string };
	searchParams: { sort: string; type: string };
}) {
	const tabValue = sort === 'popular' ? 'popular' : 'new';
	const isTable = type === 'table';
	const [curated, tracks] = await Promise.all([
		getPartnerDetailsById(id),
		getPublicTracksByPartner(id, tabValue),
	]);

	if (!curated) {
		notFound();
	}

	return (
		<>
			<CuratedDetails curated={curated} />

			<Tabs value={tabValue} className='mt-4 sm:mt-6 grid gap-2 '>
				<DynamicNav type={type} sort={sort} />

				<h1
					className={
						'text-xl md:text-[22px] font-semibold text-primary-foreground mt-4 '
					}
				>
					These tracks have been compiled by Audiomatch
				</h1>
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
