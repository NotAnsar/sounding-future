import { notFound } from 'next/navigation';

import { artists } from '@/config/dummy-data';

import ArtistDetails from '@/components/artists/ArtistDetails';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import ArtistNav from '@/components/artists/ArtistNav';
import ArtistBio from '@/components/artists/ArtistBio';
import ArtistsCarousel from '@/components/home/ArtistCarousel';

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
					<TabsContent value='tracks'>
						<div className='grid grid-cols-1 xl:grid-cols-3 gap-4'>
							<div className='xl:col-span-2 '>
								Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nemo
							</div>
							<div className='h-20 bg-green-600'></div>
						</div>
					</TabsContent>

					<ArtistBio artist={artist} />
					<ArtistsCarousel
						artists={artists}
						className='mt-12 '
						classNameItem='basis-36 sm:basis-52 lg:basis-60'
						title='Similar Artist'
					/>
				</main>
			</Tabs>
		</>
	);
}
