import HeaderBanner from '@/components/HeaderBanner';
import { cn, formatTime } from '@/lib/utils';
import { Heart } from 'lucide-react';
import Image from 'next/image';

import React from 'react';

export default function page() {
	return (
		<>
			<HeaderBanner img={'/home.png'} title='Explore 3D Audio Music' />
			<TrackList tracks={tracks} />
		</>
	);
}

type Track = {
	title: string;
	artist: string;
	genre: string;
	durationInSeconds: number;
	songUrl?: string;
	cover?: string;
	liked?: boolean;
};

const tracks: Track[] = [
	{
		title: 'Digital Mirage',
		artist: 'Anna Novak',
		genre: 'electronic music',
		durationInSeconds: 233,
		cover: '/Digital-Mirage.png',
	},
	{
		title: 'Synthwave Sunset',
		artist: 'Diego Fernandez',
		genre: 'field recording',
		durationInSeconds: 344,
		cover: '/Synthwave-Sunset.png',
		liked: true,
	},
	{
		title: 'Neon Dreams',
		artist: 'Carlos Ruiz',
		genre: 'electronic music',
		durationInSeconds: 474,
		cover: '/Neon-Dreams.png',
	},
];

function TrackList({ tracks }: { tracks: Track[] }) {
	return (
		<div className='text-gray-300 p-4 font-sans'>
			<ul className='space-y-2'>
				{tracks.map((track, index) => (
					<li key={index} className='flex items-center space-x-4 py-2'>
						<Image
							src={track.cover || '/api/placeholder/48/48'}
							alt={track.title}
							width={56}
							height={56}
							className='w-14 h-14 object-cover rounded-md border border-muted-foreground/40'
						/>
						<div className='flex-grow'>
							<h3 className='font-semibold text-xl text-white'>
								{track.title}
							</h3>

							<p className='text-xs font-light text-muted'>{track.genre}</p>
						</div>

						<p className='text-sm text-muted'>{track.artist}</p>

						<Heart
							className={cn(
								'w-5 h-5 text-muted hover:text-white cursor-pointer',
								track.liked ? 'text-white' : ''
							)}
						/>
						<span className='text-sm'>
							{formatTime(track.durationInSeconds)}
						</span>
					</li>
				))}
			</ul>
		</div>
	);
}
