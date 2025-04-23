import React from 'react';
import { TabsContent } from '../ui/tabs';
import PopularTracks from './PopularTracks';
import TracksCards from '../tracks/TracksCards';
import { getPublicTracksByArtist } from '@/db/tracks';

export default async function ArtistTrack({ id }: { id: string }) {
	const tracks = await getPublicTracksByArtist([id]);

	return (
		<TabsContent value='tracks'>
			<div className='grid grid-cols-1 xl:grid-cols-3 gap-4'>
				<div className='xl:col-span-2 space-y-8'>
					<div>
						<h1 className='text-2xl font-medium mb-6 text-primary-foreground'>
							Popular Tracks
						</h1>
						{tracks.error ? (
							<p>{tracks.message}</p>
						) : (
							<PopularTracks tracks={tracks.data} />
						)}
					</div>
					<div>
						<h1 className='text-2xl font-medium mb-6 text-primary-foreground'>
							Tracks
						</h1>

						{tracks.error ? (
							<p>{tracks.message}</p>
						) : (
							<TracksCards tracks={tracks.data} className='lg:grid-cols-3 ' />
						)}
					</div>
				</div>
			</div>
		</TabsContent>
	);
}
