import ProfileLinksForm from '@/components/profile/ProfileLinksForm';
import { getMyArticle } from '@/db/articles';

import { getMyArtist } from '@/db/artist';
import { headers } from 'next/headers';

export default async function page() {
	headers();
	const [artist, articles] = await Promise.all([getMyArtist(), getMyArticle()]);

	return <ProfileLinksForm initialData={artist} articles={articles} />;
}
