import Error from '@/components/Error';
import ArtistProfileForm from '@/components/profile/ArtistProfileForm';
import { getMyArtist } from '@/db/artist';
import { getGenres } from '@/db/genre';
import React from 'react';

export default async function page() {
	const [artist, genres] = await Promise.all([getMyArtist(), getGenres()]);

	if (genres.error) {
		return <Error message={genres.message} />;
	}

	return <ArtistProfileForm initialData={artist} genres={genres.data} />;
}
