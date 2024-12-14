import CuratedDetails from '@/components/curated/CuratedDetails';
import TrackList from '@/components/tracks/TrackList';
import TracksCards from '@/components/tracks/TracksCards';
import { Tabs } from '@radix-ui/react-tabs';
import { TabsContent } from '@/components/ui/tabs';
import DynamicNav from '@/components/curated/DynamicNav';
import { getPartnerDetailsById } from '@/db/partner';
import { getPublicTracksByPartner } from '@/db/tracks';
import Error from '@/components/Error';

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

	if (curated.error || !curated.data) {
		return <Error message={curated.message} />;
	}

	return (
		<>
			<CuratedDetails curated={curated.data} />

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
					{tracks.error ? (
						<p>{tracks.message}</p>
					) : (
						<>
							{isTable ? (
								<TrackList tracks={tracks.data} className='p-0' />
							) : (
								<TracksCards tracks={tracks.data} />
							)}
						</>
					)}
				</TabsContent>
				<TabsContent value='popular'>
					{tracks.error ? (
						<p>{tracks.message}</p>
					) : (
						<>
							{isTable ? (
								<TrackList tracks={tracks.data} className='p-0' />
							) : (
								<TracksCards tracks={tracks.data} />
							)}
						</>
					)}
				</TabsContent>
			</Tabs>
		</>
	);
}
