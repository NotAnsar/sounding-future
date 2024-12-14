import { notFound } from 'next/navigation';
import ArtistDetails from '@/components/artists/ArtistDetails';
import { Tabs } from '@/components/ui/tabs';
import ArtistNav from '@/components/artists/ArtistNav';
import ArtistBio from '@/components/artists/ArtistBio';
import ArtistsCarousel from '@/components/home/ArtistCarousel';
import ArtistTrack from '@/components/artists/ArtistTrack';
import { getArtistsById, getSimilarArtists } from '@/db/artist';
import { Suspense } from 'react';

export default async function page({
	params: { id },
	searchParams: { sort },
}: {
	params: { id: string };
	searchParams: { sort: string };
}) {
	const artist = await getArtistsById(id);
	const tabValue = sort === 'bio' ? 'bio' : 'tracks';

	if (!artist) {
		notFound();
	}

	return (
		<>
			<ArtistDetails artist={artist} />
			<Tabs value={tabValue} className='mt-4 sm:mt-8 flex flex-col sm:gap-3'>
				<ArtistNav id={id} />

				<main className='mt-4 '>
					<ArtistTrack id={id} />
					<ArtistBio artist={artist} />
					<Suspense fallback={<div>Loading similar artist...</div>}>
						<SimilarArtist
							genresId={artist.genres.map((g) => g.genreId)}
							id={artist.id}
						/>
					</Suspense>
				</main>
			</Tabs>
		</>
	);
}

async function SimilarArtist({
	genresId,
	id,
}: {
	genresId: string[];
	id?: string;
}) {
	const artists = await getSimilarArtists(genresId, 8, id);

	if (!artists.error) {
		return null;
	}

	return (
		<>
			{artists.data.length > 0 && (
				<ArtistsCarousel
					artists={artists.data}
					className='mt-12 '
					classNameItem='basis-36 sm:basis-52 lg:basis-60'
					title='Artists you may also like'
				/>
			)}
		</>
	);
}
