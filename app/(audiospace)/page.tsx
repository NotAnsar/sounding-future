import HeaderBanner from '@/components/HeaderBanner';
import ArtistsCarousel from '@/components/home/ArtistCarousel';
import BannersSection from '@/components/home/BannersSection';
import PartnersCarousel from '@/components/home/CollectionsCarousel';
import GenresCarousel from '@/components/home/GenresCarousel';
import TracksCarousel from '@/components/home/NewTracks';

import { getArtists } from '@/db/artist';
import { getGenres } from '@/db/genre';
import { getPartners } from '@/db/partner';
import { getPublicTracks } from '@/db/tracks';

export default async function page() {
	const [tracks, genres, partners, artists] = await Promise.all([
		getPublicTracks(8, 'new'),
		getGenres(),
		getPartners(),
		getArtists(8),
	]);

	return (
		<>
			<HeaderBanner
				img={'/banners/home.jpg'}
				title='Explore 3D Audio Music'
				className='mb-8'
			/>
			<div className='grid grid-cols-3 gap-6'>
				<div className='flex flex-col gap-12 col-span-full xl:col-span-2'>
					{!tracks.error && (
						<TracksCarousel tracks={tracks.data} title='New Tracks' />
					)}
					{!genres.error && (
						<GenresCarousel title='Tracks by genre' genres={genres.data} />
					)}
					{!partners.error && (
						<PartnersCarousel
							title='Curated Collections'
							partners={partners.data}
						/>
					)}

					{!artists.error && <ArtistsCarousel artists={artists.data} />}
				</div>
				<BannersSection />
			</div>
		</>
	);
}
