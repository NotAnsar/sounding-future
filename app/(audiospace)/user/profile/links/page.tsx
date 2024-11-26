import ArtistError from '@/components/ArtistError';
import ProfileLinksForm from '@/components/profile/ProfileLinksForm';
import { getMyArticle } from '@/db/articles';
import { getMyArtist } from '@/db/artist';

export default async function page() {
	const [artist, articles] = await Promise.all([getMyArtist(), getMyArticle()]);

	if (articles.artistError) {
		return <ArtistError />;
	}

	return <ProfileLinksForm initialData={artist} articles={articles.data} />;
}
