import HeaderBanner from '@/components/HeaderBanner';
import ArtistsCarousel from '@/components/home/ArtistCarousel';
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
			<div className='flex flex-col gap-12'>
				{!tracks.error && (
					<TracksCarousel
						tracks={tracks.data}
						title='New Tracks'
						className='xl:w-2/3'
					/>
				)}
				{!genres.error && (
					<GenresCarousel
						className='xl:w-2/3'
						title='Tracks by genre'
						genres={genres.data}
					/>
				)}
				{!partners.error && (
					<PartnersCarousel
						className='xl:w-2/3'
						title='Curated Collections'
						partners={partners.data}
					/>
				)}

				{!artists.error && (
					<ArtistsCarousel className='xl:w-2/3' artists={artists.data} />
				)}
			</div>
		</>
	);
}
