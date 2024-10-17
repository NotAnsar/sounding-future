import HeaderBanner from '@/components/HeaderBanner';
import ArtistsCarousel from '@/components/home/ArtistCarousel';
import CollectionsCarousel from '@/components/home/CollectionsCarousel';
import GenresCarousel from '@/components/home/GenresCarousel';
import TracksCarousel from '@/components/home/NewTracks';
import { artists, collections, genres, tracks } from '@/config/dummy-data';

export default async function page() {
	return (
		<>
			<HeaderBanner
				img={'/banners/home.jpg'}
				title='Explore 3D Audio Music'
				className='mb-8'
			/>
			<div className='flex flex-col gap-12'>
				<TracksCarousel
					tracks={tracks}
					title='New Tracks'
					className='xl:w-2/3'
				/>
				<GenresCarousel
					className='xl:w-2/3'
					title='Tracks by genre'
					genres={genres}
				/>
				<CollectionsCarousel
					className='xl:w-2/3'
					title='Curated Collections'
					collections={collections}
				/>
				<ArtistsCarousel className='xl:w-2/3' artists={artists} />
			</div>
		</>
	);
}
