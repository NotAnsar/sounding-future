import Error from '@/components/Error';
import GenreList from '@/components/genres/GenreList';
import HeaderBanner from '@/components/HeaderBanner';
import { getGenres } from '@/db/genre';
import { generateGenresListingSchema } from '@/schema/genres-schema';

export async function generateMetadata() {
	const genres = await getGenres();
	const schema = generateGenresListingSchema(genres.data);

	return {
		title: 'Genres - Explore Our Music Collection',
		description:
			'Discover a wide variety of music genres and find your favorite tunes',
		openGraph: {
			title: 'Genres Collection',
			description: 'Explore our diverse collection of music genres',
			images: ['/banners/genres.jpg'],
			type: 'website',
		},
		other: {
			'schema:collection-page': JSON.stringify(schema),
		},
	};
}

export default async function page() {
	const genres = await getGenres();

	if (genres.error) {
		return <Error message={genres.message} />;
	}

	return (
		<>
			<script
				type='application/ld+json'
				key='structured-data'
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(generateGenresListingSchema(genres.data)),
				}}
			/>
			<HeaderBanner img={'/banners/genres.jpg'} title='Genres' />
			<GenreList className='mt-12' genres={genres.data} />
		</>
	);
}
