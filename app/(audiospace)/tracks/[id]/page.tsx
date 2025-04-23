import { TabsContent } from '@/components/ui/tabs';
import TrackDetails from '@/components/tracks/track/TrackDetails';
import { Tabs } from '@/components/ui/tabs';
import TrackList from '@/components/tracks/TrackList';
import TrackNav from '@/components/tracks/track/TrackNav';
import TracksCarousel from '@/components/home/NewTracks';
import CollapsibleText from '@/components/CollapsibleText';
import {
	getArtistSimilarTracks,
	getPublicTracksByArtist,
	getPublicTracksById,
} from '@/db/tracks';
import TrackArtistDetails from '@/components/tracks/track/TrackArtist';
import { Genre } from '@prisma/client';
import { Suspense } from 'react';
import Error from '@/components/Error';
import { Metadata } from 'next';
import { generateTrackSchema } from '@/schema/tracks-schema';
import { CalendarFold, Disc3 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export async function generateMetadata({
	params,
}: {
	params: { id: string };
}): Promise<Metadata> {
	const trackRes = await getPublicTracksById(params.id);
	if (!trackRes.data) return { title: 'Track Not Found' };

	const track = trackRes.data;

	return {
		title: `${track.title} • ${track.artists
			.map((a) => a.artist.name)
			.join(', ')} - Track`,
		description:
			track.info ||
			`Listen to ${track.title} by ${track.artists
				.map((a) => a.artist.name)
				.join(', ')}`,
		openGraph: {
			title: `${track.title} • ${track.artists
				.map((a) => a.artist.name)
				.join(', ')} - Track`,
			description:
				track.info ||
				`Listen to ${track.title} by ${track.artists
					.map((a) => a.artist.name)
					.join(', ')}`,
			images: [track.cover],
			type: 'music.song',
		},
		other: {
			'schema:music-recording': JSON.stringify(generateTrackSchema(track)),
		},
	};
}

export default async function page({
	params: { id },
	searchParams: { sort },
}: {
	params: { id: string };
	searchParams: { sort: string };
}) {
	const trackRes = await getPublicTracksById(id);

	const tabValue = sort === 'artist' || sort === 'others' ? sort : 'info';

	if (trackRes.error || !trackRes.data) {
		return <Error message={trackRes.message} />;
	}

	const track = trackRes.data;

	return (
		<>
			<script
				type='application/ld+json'
				key='structured-data'
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(generateTrackSchema(track)),
				}}
			/>

			<TrackDetails track={track} />
			<Tabs value={tabValue} className='mt-4 sm:mt-8 flex flex-col sm:gap-3'>
				<TrackNav id={id} />

				<main className='mt-8'>
					<div className='grid grid-cols-1 xl:grid-cols-3 gap-4'>
						<div className='xl:col-span-2 '>
							<TabsContent value='info'>
								{track?.info && (
									<CollapsibleText text={track?.info} className='max-w-2xl' />
								)}
								{track?.credits && (
									<div className='mt-6'>
										<h1 className='text-xl font-semibold text-primary-foreground mb-4'>
											Credits
										</h1>
										<p className='text-pretty leading-7'>{track?.credits}</p>
									</div>
								)}
							</TabsContent>
							<TabsContent value='others'>
								<p className='font-semibold text-muted text-lg mb-4 px-2'>
									Other tracks from{' '}
									{track?.artists.map(
										(a, i) =>
											a.artist.name +
											(i === track.artists.length - 1 ? '' : ', ')
									)}
								</p>

								<Suspense
									fallback={<div>Loading tracks by current artist...</div>}
								>
									<TracksByCurrentArtist
										artistId={track.artists.map((a) => a.artist.slug)}
									/>
								</Suspense>
							</TabsContent>
							<TrackArtistDetails artists={track.artists} />
							{/* <TrackArtistDetails artist={track.artist} /> */}
						</div>
						<div>
							<ul className='mt-2 px-8 py-6 bg-player rounded-2xl text-center justify-center space-y-3'>
								<li className='flex gap-3'>
									{track.genres.map((g) => (
										<Badge
											key={g.genreId}
											className='text-white font-normal bg-transparent border-foreground text-foreground '
											variant={'secondary'}
										>
											{g.genre.name}
										</Badge>
									))}
								</li>
								<li className='flex gap-3'>
									<CalendarFold className='w-5 h-auto aspect-auto text-foreground' />{' '}
									{track?.releaseYear}
								</li>

								{track?.sourceFormat?.name && (
									<li className='flex gap-3'>
										<Disc3 className='w-5 h-auto aspect-auto text-foreground' />{' '}
										{track?.sourceFormat?.name}
									</li>
								)}
								{track?.curator?.name && (
									<li className='w-fit flex flex-col gap-1 text-left'>
										<h4>Track curated by:</h4>
										<p>{track?.curator?.name}</p>
									</li>
								)}
							</ul>
						</div>
					</div>

					<Suspense fallback={<div>Loading similar tracks...</div>}>
						<SimilarTracks
							genres={track.genres.map((g) => g.genre)}
							id={track.id}
						/>
					</Suspense>
				</main>
			</Tabs>
		</>
	);
}

async function SimilarTracks({ genres, id }: { genres: Genre[]; id?: string }) {
	const tracks = await getArtistSimilarTracks(
		genres.map((g) => g.id),
		'default',
		8,
		id
	);

	if (tracks.error) {
		return null;
	}

	return (
		<>
			{tracks.data.length > 0 && (
				<TracksCarousel
					tracks={tracks.data}
					title='Tracks you may also like'
					classNameItem='basis-36 sm:basis-52 lg:basis-64'
					className='mt-12 '
					classNameTitle='text-[18px] sm:text-[22px]'
				/>
			)}
		</>
	);
}

async function TracksByCurrentArtist({ artistId }: { artistId: string[] }) {
	const tracks = await getPublicTracksByArtist(artistId, 8);

	if (tracks.error) {
		return null;
	}

	return <TrackList tracks={tracks.data} className='lg:w-full p-0' />;
}
