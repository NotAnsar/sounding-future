import { Genre } from '@prisma/client';

export function generateGenreSchema(genre: Genre) {
	const baseUrl =
		process.env.NEXTAUTH_URL || 'http://soundingfuture.vercel.app/';

	return {
		'@context': 'https://schema.org',
		'@type': 'MusicGenre',
		name: genre.name,
		url: `${baseUrl}/genres/${genre.id}`,
	};
}

export function generateGenresListingSchema(genres: Genre[]) {
	const baseUrl =
		process.env.NEXTAUTH_URL || 'http://soundingfuture.vercel.app/';

	return {
		'@context': 'https://schema.org',
		'@type': 'CollectionPage',
		name: 'Music Genres Collection',
		description: 'Browse our collection of music genres',
		url: `${baseUrl}/genres`,
		mainEntity: {
			'@type': 'ItemList',
			numberOfItems: genres.length,
			itemListElement: genres.map((genre, index) => ({
				'@type': 'ListItem',
				position: index + 1,
				item: {
					'@type': 'MusicGenre',
					name: genre.name,
					url: `${baseUrl}/genres/${genre.id}`,
				},
			})),
		},
	};
}
