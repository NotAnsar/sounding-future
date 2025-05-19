import ArtistForm from '@/components/artists-crud/upload/ArtistForm';
import BreadCrumb from '@/components/BreadCrumb';
import Error from '@/components/Error';
import { getGenres } from '@/db/genre';

export default async function Page() {
	const [genres] = await Promise.all([getGenres()]);

	if (genres.error) {
		return <Error message={genres.message} />;
	}

	return (
		<div className='mt-4'>
			<BreadCrumb
				items={[
					{ link: '/user/artists', text: 'Artists' },

					{
						link: '/user/artists/new',
						text: 'Add Artist',
						isCurrent: true,
					},
				]}
			/>
			<ArtistForm genres={genres.data} />
		</div>
	);
}
