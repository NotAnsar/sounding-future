import HeaderBanner from '@/components/HeaderBanner';
import ArtistsCarousel from '@/components/home/ArtistCarousel';
import CollectionsCarousel from '@/components/home/CollectionsCarousel';
import GenresCarousel from '@/components/home/GenresCarousel';
import TracksCarousel from '@/components/home/NewTracks';
import { artists, tracks } from '@/config/dummy-data';

export default function page() {
	return (
		<>
			<HeaderBanner
				img={'/home.png'}
				title='Explore 3D Audio Music'
				className='mb-8'
			/>
			<div className='flex flex-col gap-12'>
				<TracksCarousel
					tracks={tracks}
					title='New Tracks'
					className='xl:w-2/3'
				/>
				<GenresCarousel className='xl:w-2/3' title='Tracks by genre' />
				<CollectionsCarousel className='xl:w-2/3' title='Curated Collections' />
				<ArtistsCarousel className='xl:w-2/3' artists={artists} />
			</div>
		</>
	);
}
