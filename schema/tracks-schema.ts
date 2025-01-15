import { PublicTrackWithLikeStatus, TrackDetails } from '@/db/tracks';

export function generateTrackSchema(track: TrackDetails) {
	const baseUrl =
		process.env.NEXTAUTH_URL || 'http://soundingfuture.vercel.app/';

	return {
		'@context': 'https://schema.org',
		'@type': 'MusicRecording',
		name: track.title,
		byArtist: {
			'@type': 'MusicGroup',
			name: track.artist.name,
			url: `${baseUrl}/artists/${track.artistId}`,
			image: track.artist.pic,
			sameAs: track.artist.socialLinks
				? [
						track.artist.socialLinks.facebook,
						track.artist.socialLinks.instagram,
						track.artist.socialLinks.website,
						track.artist.socialLinks.linkedin,
						track.artist.socialLinks.website,
						track.artist.socialLinks.youtube,
				  ].filter(Boolean)
				: undefined,
		},
		duration: track.duration
			? `PT${Math.floor(track.duration / 60)}M${track.duration % 60}S`
			: undefined,
		genre: track.genres.map((g) => g.genre.name),
		datePublished: track.releaseYear?.toString(),
		description: track.info,
		url: `${baseUrl}/tracks/${track.id}`,
		image: track.cover,
		...(track.curator && {
			producer: {
				'@type': 'Organization',
				name: track.curator.name,
				url: `${baseUrl}/curated/${track.curator.id}`,
			},
		}),
	};
}

export function generateTracksListingSchema(
	tracks: PublicTrackWithLikeStatus[]
) {
	const baseUrl =
		process.env.NEXTAUTH_URL || 'http://soundingfuture.vercel.app/';

	return {
		'@context': 'https://schema.org',
		'@type': 'CollectionPage',
		name: 'Sound Tracks Collection',
		description: 'Browse our collection of 3D audio tracks',
		url: `${baseUrl}/tracks`,
		mainEntity: {
			'@type': 'ItemList',
			numberOfItems: tracks.length,
			itemListElement: tracks.map((track, index) => ({
				'@type': 'ListItem',
				position: index + 1,
				item: {
					'@type': 'MusicRecording',
					name: track.title,
					url: `${baseUrl}/tracks/${track.id}`,
					duration: track.duration
						? `PT${Math.floor(track.duration / 60)}M${track.duration % 60}S`
						: undefined,
					byArtist: {
						'@type': 'MusicGroup',
						name: track.artist.name,
						url: `${baseUrl}/artists/${track.artist.id}`,
					},
					genre: track.genres.map((g) => g.genre.name),
					image: track.cover,
					interactionStatistic: [
						{
							'@type': 'InteractionCounter',
							interactionType: 'https://schema.org/LikeAction',
							userInteractionCount: track._count?.likes,
						},
					],
				},
			})),
		},
	};
}
