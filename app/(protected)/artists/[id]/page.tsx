import { notFound } from 'next/navigation';

import { artists } from '@/config/dummy-data';

import ArtistDetails from '@/components/artists/ArtistDetails';
import { Tabs } from '@/components/ui/tabs';
import ArtistNav from '@/components/artists/ArtistNav';
import ArtistBio from '@/components/artists/ArtistBio';
import ArtistsCarousel from '@/components/home/ArtistCarousel';
import ArtistTrack from '@/components/artists/ArtistTrack';

export default function page({
	params: { id },
	searchParams: { sort },
}: {
	params: { id: string };
	searchParams: { sort: string };
}) {
	const artist = artists.find((a) => a.id === id);
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
					<ArtistBio /* artist={artist} */ />
					<ArtistsCarousel
						artists={artists}
						className='mt-12 '
						classNameItem='basis-36 sm:basis-52 lg:basis-60'
						title='Artists you may also like'
					/>
				</main>
			</Tabs>
		</>
	);
}
