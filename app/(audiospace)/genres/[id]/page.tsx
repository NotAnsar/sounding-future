import { notFound } from 'next/navigation';
import TrackList from '@/components/tracks/TrackList';
import TracksCards from '@/components/tracks/TracksCards';
import { Tabs } from '@radix-ui/react-tabs';
import { TabsContent } from '@/components/ui/tabs';
import GenreDetails from '@/components/genres/GenreDetails';
import DynamicNav from '@/components/curated/DynamicNav';
import { getGenreDetailsById } from '@/db/genre';
import { getPublicTracksByGenre } from '@/db/tracks';

export default async function page({
	params: { id },
	searchParams: { sort, type },
}: {
	params: { id: string };
	searchParams: { sort: string; type: string };
}) {
	const tabValue = sort === 'popular' ? 'popular' : 'new';
	const isTable = type === 'table';
	const [genre, tracks] = await Promise.all([
		getGenreDetailsById(id),
		getPublicTracksByGenre(id, tabValue),
	]);

	if (!genre) {
		notFound();
	}

	return (
		<>
			<GenreDetails genre={genre} />

			<Tabs value={tabValue} className='mt-4 sm:mt-6 grid gap-2 '>
				<DynamicNav type={type} sort={sort} />

				<h1
					className={
						'text-xl md:text-[22px] font-semibold text-primary-foreground mt-4 '
					}
				>
					All files of the genre {genre.name}
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
