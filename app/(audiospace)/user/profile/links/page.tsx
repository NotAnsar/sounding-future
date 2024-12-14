import Error from '@/components/Error';
import ProfileLinksForm from '@/components/profile/ProfileLinksForm';
import { getMyArticle } from '@/db/articles';
import { getMyArtist } from '@/db/artist';

export default async function page() {
	const [artist, articles] = await Promise.all([getMyArtist(), getMyArticle()]);

	if (articles.error) {
		return <Error message={articles.message} />;
	}

	return <ProfileLinksForm initialData={artist} articles={articles.data} />;
}
