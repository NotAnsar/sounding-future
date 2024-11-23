import ProfileLinksForm from '@/components/profile/ProfileLinksForm';
import { getMyArticle } from '@/db/articles';
import { getMyArtist } from '@/db/artist';

export default async function page() {
	const [artist, articles] = await Promise.all([getMyArtist(), getMyArticle()]);
	console.log(artist, articles);

	return <ProfileLinksForm initialData={artist} articles={articles} />;
}
