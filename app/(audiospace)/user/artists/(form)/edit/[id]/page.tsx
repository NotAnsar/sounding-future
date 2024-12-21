import ArtistForm from '@/components/artists-crud/upload/ArtistForm';
import BreadCrumb from '@/components/BreadCrumb';
import Error from '@/components/Error';

import { getArtistsById } from '@/db/artist';
import { getGenres } from '@/db/genre';

export default async function Page({
	params: { id },
}: {
	params: { id: string };
}) {
	const [genres, artist] = await Promise.all([
		getGenres(),
		getArtistsById(id, false),
	]);

	if (!artist) {
		return <Error message='Artist not found' />;
	}

	if (genres.error) {
		return <Error message={genres.message} />;
	}

	return (
		<div className='mt-4'>
			<BreadCrumb
				items={[
					{ link: '/user/artists', text: 'Artists' },
					{
						link: `/user/artists/edit/${id}`,
						text: 'Edit Artist',
						isCurrent: true,
					},
				]}
			/>
			<ArtistForm genres={genres.data} initialData={artist} />
		</div>
	);
}
