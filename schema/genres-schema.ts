import { Genre } from '@prisma/client';
import { Thing, WithContext } from 'schema-dts';

export function generateGenreSchema(genre: Genre) {
	const baseUrl =
		process.env.NEXTAUTH_URL || 'http://soundingfuture.vercel.app/';

	const jsonLd: WithContext<Thing> = {
		'@context': 'https://schema.org',
		'@type': 'Thing',
		name: genre.name,
		url: `${baseUrl}/genres/${genre.id}`,
		additionalType: 'MusicGenre',
		description: `Music genre: ${genre.name}`,
	};
	return jsonLd;
}

export function generateGenresListingSchema(genres: Genre[]) {
	const baseUrl =
		process.env.NEXTAUTH_URL || 'http://soundingfuture.vercel.app/';

	const jsonLd: WithContext<Thing> = {
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
					'@type': 'Thing', // Changed from MusicGenre to Thing
					additionalType: 'MusicGenre',
					name: genre.name,
					url: `${baseUrl}/genres/${genre.id}`,
					description: `Music genre: ${genre.name}`,
				},
			})),
		},
	};
	return jsonLd;
}
