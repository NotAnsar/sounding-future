import React from 'react';
import { TabsContent } from '../ui/tabs';
import { tracks } from '@/config/dummy-data';
import PopularTracks from './PopularTracks';
import TracksCards from '../tracks/TracksCards';

export default function ArtistTrack({ id }: { id: string }) {
	return (
		<TabsContent value='tracks'>
			<div className='grid grid-cols-1 xl:grid-cols-3 gap-4'>
				<div className='xl:col-span-2 space-y-8'>
					<div className=''>
						<h1 className='text-2xl font-medium mb-6 text-primary-foreground'>
							Popular Songs
						</h1>
						<PopularTracks
							tracks={tracks.filter((t) => t.artist.id === id).splice(0, 10)}
						/>
					</div>
					<div className=''>
						<h1 className='text-2xl font-medium mb-6 text-primary-foreground'>
							Discography
						</h1>

						<TracksCards
							tracks={tracks.filter((t) => t.artist.id === id).splice(0, 10)}
							className='2xl:grid-cols-3'
						/>
					</div>
				</div>
				<div className=''></div>
			</div>
		</TabsContent>
	);
}
