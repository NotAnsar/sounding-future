import TrackList from '@/components/tracks/TrackList';
import TracksCards from '@/components/tracks/TracksCards';
import { Tabs } from '@radix-ui/react-tabs';
import { TabsContent } from '@/components/ui/tabs';
import GenreDetails from '@/components/genres/GenreDetails';
import DynamicNav from '@/components/curated/DynamicNav';
import { getGenreDetailsById } from '@/db/genre';
import { getPublicTracksByGenre } from '@/db/tracks';
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
	const [genre, tracks] = await Promise.all([
		getGenreDetailsById(id),
		getPublicTracksByGenre(id, tabValue),
	]);

	if (genre.error || !genre.data) {
		return <Error message={genre.message} />;
	}

	return (
		<>
			<GenreDetails genre={genre.data} />

			<Tabs value={tabValue} className='mt-4 sm:mt-6 grid gap-2 '>
				<DynamicNav type={type} sort={sort} />

				<h1
					className={
						'text-xl md:text-[22px] font-semibold text-primary-foreground mt-4 '
					}
				>
					All files of the genre {genre.data.name}
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
