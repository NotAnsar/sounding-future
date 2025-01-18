import { ArtistDetails, ArtistList } from '@/db/artist';
import type { MusicGroup } from 'schema-dts';

export function generateArtistsListingSchema(artists: ArtistList[]) {
	const baseUrl =
		process.env.NEXTAUTH_URL || 'http://soundingfuture.vercel.app/';

	return {
		'@context': 'https://schema.org',
		'@type': 'CollectionPage',

		name: 'Artists Collection',
		description: 'Browse our collection of innovative audio artists',
		url: `${baseUrl}/artists`,
		mainEntity: {
			'@type': 'ItemList',
			numberOfItems: artists.length,
			itemListElement: artists.map((artist, index) => ({
				'@type': 'ListItem',
				position: index + 1,
				item: {
					'@type': 'MusicGroup',
					name: artist.name,
					url: `${baseUrl}/artists/${artist.slug}`,
					description: artist.bio || undefined,
					image: artist.pic || undefined,
					genre: artist.genres.map((g) => g.genre.name),
					sameAs: [
						artist.socialLinks?.facebook,
						artist.socialLinks?.instagram,
						artist.socialLinks?.linkedin,
						artist.socialLinks?.vimeo,
						artist.socialLinks?.website,
						artist.socialLinks?.youtube,
						artist.socialLinks?.mastodon,
					].filter(Boolean),
					interactionStatistic: [
						{
							'@type': 'InteractionCounter',
							interactionType: 'https://schema.org/CreateAction',
							userInteractionCount: artist._count?.tracks || 0,
						},
					],
				},
			})),
		},
	};
}

export function generateArtistSchema(artist: ArtistDetails) {
	const baseUrl =
		process.env.NEXTAUTH_URL || 'http://soundingfuture.vercel.app/';

	const schema: MusicGroup = {
		'@id': 'https://schema.org',
		'@type': 'MusicGroup',
		name: artist.name,
		description: artist.bio || '',
		image: artist.pic || undefined,
		url: `${baseUrl}/artists/${artist.slug}`,
		genre: artist.genres.map((g) => g.genre.name),
		sameAs: artist.socialLinks
			? [
					artist.socialLinks.facebook,
					artist.socialLinks.instagram,
					artist.socialLinks.linkedin,
					artist.socialLinks.vimeo,
					artist.socialLinks.website,
					artist.socialLinks.youtube,
					artist.socialLinks.mastodon,
			  ].filter((link): link is string => Boolean(link))
			: undefined,
		...(artist.articles.length > 0 && {
			subjectOf: artist.articles.map((a) => ({
				'@type': 'Article',
				name: a.article.title || '',
				url: `${baseUrl}/articles/${a.article.id}`,
				datePublished: a.article.createdAt?.toISOString(),
			})),
		}),
		mainEntityOfPage: {
			'@type': 'ProfilePage',
			'@id': `${baseUrl}/artists/${artist.slug}`,
		},
	};
	return schema;
}
