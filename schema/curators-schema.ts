import { PartnerDetails } from '@/db/partner';
import { PublicTrackWithLikeStatus } from '@/db/tracks';
import { Partner } from '@prisma/client';
import { Organization, WithContext } from 'schema-dts';

export function generateCuratorSchema(
	partner: PartnerDetails,
	tracks: PublicTrackWithLikeStatus[]
) {
	const baseUrl =
		process.env.NEXTAUTH_URL || 'http://soundingfuture.vercel.app/';

	const jsonld: WithContext<Organization> = {
		'@context': 'https://schema.org',
		'@type': 'Organization',
		name: partner.name,
		url: `${baseUrl}/curators/${partner.id}`,
		image: partner.studioPic || undefined,
		description:
			partner.bio ||
			`${partner.name} is a curator on Sounding Future, specializing in curating innovative audio experiences.`,
		sameAs: partner.socialLinks
			? [
					partner.socialLinks.facebook,
					partner.socialLinks.instagram,
					partner.socialLinks.linkedin,
					partner.socialLinks.vimeo,
					partner.socialLinks.website,
					partner.socialLinks.youtube,
					partner.socialLinks.mastodon,
			  ].filter((link): link is string => Boolean(link))
			: undefined,
		location: {
			'@type': 'Place',
			address: {
				'@type': 'PostalAddress',
				addressCountry: partner.country,
			},
		},
		subjectOf: {
			'@type': 'MusicPlaylist',
			name: `${partner.name} Curated Collection`,
			description: `A curated collection of tracks selected by ${partner.name}`,
			url: `${baseUrl}/curators/${partner.id}/tracks`,
			image: partner.studioPic || partner.picture,
			numTracks: tracks.length,
			track: tracks.map((track) => ({
				'@type': 'MusicRecording',
				name: track.title,
				byArtist: {
					'@type': 'MusicGroup',
					name: track.artist.name,
					url: `${baseUrl}/artists/${track.artist.slug}`,
				},
				url: `${baseUrl}/tracks/${track.slug}`,
				duration: track.duration
					? `PT${Math.floor(track.duration / 60)}M${track.duration % 60}S`
					: undefined,
				image: track.cover,
				datePublished: track.releaseYear?.toString(),
				description: track.info || undefined,
				...(track.variant1 && {
					additionalProperty: [
						{
							'@type': 'PropertyValue',
							name: 'binaural',
							value: 'variant1',
							url: track.variant1,
						},
						track.variant2 && {
							'@type': 'PropertyValue',
							name: 'binaural+',
							value: 'variant2',
							url: track.variant2,
						},
						track.variant3 && {
							'@type': 'PropertyValue',
							name: 'stereo',
							value: 'variant3',
							url: track.variant3,
						},
					].filter(Boolean),
				}),
			})),
		},
	};

	return jsonld;
}

export function generatePartnersListingSchema(partners: Partner[]) {
	const baseUrl =
		process.env.NEXTAUTH_URL || 'http://soundingfuture.vercel.app/';

	return {
		'@context': 'https://schema.org',
		'@type': 'CollectionPage',
		name: 'Curators Collection',
		description: 'Browse our collection of music curators and sound experts',
		url: `${baseUrl}/curators`,
		mainEntity: {
			'@type': 'ItemList',
			numberOfItems: partners.length,
			itemListElement: partners.map((partner, index) => ({
				'@type': 'ListItem',
				position: index + 1,
				item: {
					'@type': 'Organization',
					name: partner.name,
					url: `${baseUrl}/curators/${partner.id}`,
					image: partner.studioPic || partner.picture,
					description: partner.bio,
					location: {
						'@type': 'Place',
						address: {
							'@type': 'PostalAddress',
							addressCountry: partner.country,
						},
					},
				},
			})),
		},
	};
}
