import GenreList from '@/components/genres/GenreList';
import HeaderBanner from '@/components/HeaderBanner';
import { getGenres } from '@/db/genre';

export default async function page() {
	const genres = await getGenres();

	return (
		<>
			<HeaderBanner img={'/banners/genres.jpg'} title='Genres' />
			<GenreList className='mt-12' genres={genres} />
		</>
	);
}
