import { PublicTrackWithLikeStatus, TrackDetails } from '@/db/tracks';

export function generateTrackSchema(track: TrackDetails) {
	const baseUrl =
		process.env.NEXTAUTH_URL || 'http://soundingfuture.vercel.app/';

	// Get primary artists from the artists array
	const artists = track.artists || [];

	return {
		'@context': 'https://schema.org',
		'@type': 'MusicRecording',
		name: track.title,
		byArtist:
			artists.length > 1
				? artists.map((artistItem) => ({
						'@type': 'MusicGroup',
						name: artistItem.artist.name,
						url: `${baseUrl}/artists/${artistItem.artist.slug}`,
						image: artistItem.artist.pic,
						sameAs: artistItem.artist.socialLinks
							? [
									artistItem.artist.socialLinks.facebook,
									artistItem.artist.socialLinks.instagram,
									artistItem.artist.socialLinks.website,
									artistItem.artist.socialLinks.linkedin,
									artistItem.artist.socialLinks.youtube,
									artistItem.artist.socialLinks.mastodon,
							  ].filter(Boolean)
							: undefined,
				  }))
				: artists.length === 1
				? {
						'@type': 'MusicGroup',
						name: artists[0].artist.name,
						url: `${baseUrl}/artists/${artists[0].artist.slug}`,
						image: artists[0].artist.pic,
						sameAs: artists[0].artist.socialLinks
							? [
									artists[0].artist.socialLinks.facebook,
									artists[0].artist.socialLinks.instagram,
									artists[0].artist.socialLinks.website,
									artists[0].artist.socialLinks.linkedin,
									artists[0].artist.socialLinks.youtube,
									artists[0].artist.socialLinks.mastodon,
							  ].filter(Boolean)
							: undefined,
				  }
				: {
						'@type': 'MusicGroup',
						name: 'Unknown Artist',
						url: `${baseUrl}/artists/unknown`,
				  },
		duration: track.duration
			? `PT${Math.floor(track.duration / 60)}M${track.duration % 60}S`
			: undefined,
		genre: track.genres.map((g) => g.genre.name),
		datePublished: track.releaseYear?.toString(),
		description: track.info,
		url: `${baseUrl}/tracks/${track.slug}`,
		image: track.cover,
		...(track.curator && {
			producer: {
				'@type': 'Organization',
				name: track.curator.name,
				url: `${baseUrl}/curated/${track.curator.slug}`,
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
			itemListElement: tracks.map((track, index) => {
				const artists = track.artists || [];

				return {
					'@type': 'ListItem',
					position: index + 1,
					item: {
						'@type': 'MusicRecording',
						name: track.title,
						url: `${baseUrl}/tracks/${track.slug}`,
						duration: track.duration
							? `PT${Math.floor(track.duration / 60)}M${track.duration % 60}S`
							: undefined,
						byArtist:
							artists.length > 1
								? artists.map((artistItem) => ({
										'@type': 'MusicGroup',
										name: artistItem.artist.name,
										url: `${baseUrl}/artists/${artistItem.artist.slug}`,
								  }))
								: artists.length === 1
								? {
										'@type': 'MusicGroup',
										name: artists[0].artist.name,
										url: `${baseUrl}/artists/${artists[0].artist.slug}`,
								  }
								: {
										'@type': 'MusicGroup',
										name: 'Unknown Artist',
										url: `${baseUrl}/artists/unknown`,
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
				};
			}),
		},
	};
}
