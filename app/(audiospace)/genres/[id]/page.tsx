import { notFound } from 'next/navigation';
import { genres, tracks } from '@/config/dummy-data';
import TrackList from '@/components/tracks/TrackList';
import TracksCards from '@/components/tracks/TracksCards';
import { Tabs } from '@radix-ui/react-tabs';
import { TabsContent } from '@/components/ui/tabs';
import GenreDetails from '@/components/genres/GenreDetails';
import DynamicNav from '@/components/curated/DynamicNav';

export default function page({
	params: { id },
	searchParams: { sort, type },
}: {
	params: { id: string };
	searchParams: { sort: string; type: string };
}) {
	const tabValue = sort === 'popular' ? 'popular' : 'new';
	const isTable = type === 'table';
	const genre = genres.find((a) => a.id === id);

	if (!genre) {
		notFound();
	}

	const filteredTracks = tracks.filter((t) => t.genre.id === genre.id);
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
