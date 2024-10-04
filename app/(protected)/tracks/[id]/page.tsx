import React from 'react';
import { tracks } from '../../page';
import { notFound } from 'next/navigation';
import TrackDetails from '@/components/tracks/track/TrackDetails';

export default function page({ params: { id } }: { params: { id: string } }) {
	const track = tracks.find((t) => t.id === id);

	if (!track) {
		notFound();
	}

	return (
		<div>
			<TrackDetails track={track} />
			<p className='mt-8'>page {id}</p>
		</div>
	);
}
