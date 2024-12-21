import ArtistLinksForm from '@/components/artists-crud/upload/ArtistLinksForm';
import BreadCrumb from '@/components/BreadCrumb';
import Error from '@/components/Error';
import { getArticlesByArtistId } from '@/db/articles';
import { getArtistsById } from '@/db/artist';

export default async function Page({
	params: { id },
}: {
	params: { id: string };
}) {
	const [artist, articles] = await Promise.all([
		getArtistsById(id, false),
		getArticlesByArtistId(id),
	]);

	if (!artist) {
		return <Error message='Artist not found' />;
	}

	if (articles.error) {
		return <Error message={articles.message} />;
	}
	return (
		<div className='mt-4'>
			<BreadCrumb
				items={[
					{ link: '/user/artists', text: 'Artists' },

					{
						link: `/user/artists/links/${id}`,
						text: 'Edit Artist Links',
						isCurrent: true,
					},
				]}
			/>
			<ArtistLinksForm
				artistId={id}
				initialData={artist}
				articles={articles.data}
			/>
		</div>
	);
}
