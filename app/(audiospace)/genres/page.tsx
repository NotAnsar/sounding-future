import GenreList from '@/components/genres/GenreList';
import HeaderBanner from '@/components/HeaderBanner';
import { genres } from '@/config/dummy-data';

export default async function page() {
	
	return (
		<>
			<HeaderBanner img={'/banners/genres.jpg'} title='Genres' />
			<GenreList className='mt-12' genres={genres} />
		</>
	);
}
