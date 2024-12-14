import Error from '@/components/Error';
import GenreList from '@/components/genres/GenreList';
import HeaderBanner from '@/components/HeaderBanner';
import { getGenres } from '@/db/genre';

export default async function page() {
	const genres = await getGenres();

	if (genres.error) {
		return <Error message={genres.message} />;
	}

	return (
		<>
			<HeaderBanner img={'/banners/genres.jpg'} title='Genres' />
			<GenreList className='mt-12' genres={genres.data} />
		</>
	);
}
