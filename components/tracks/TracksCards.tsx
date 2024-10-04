'use client';

import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Track, useAudio } from '@/context/AudioContext';
import { PauseIcon, PlayIcon } from 'lucide-react';

export default function TracksCards({
	tracks,
	className,
}: {
	tracks: Track[];
	className?: string;
}) {
	const { currentTrack, isPlaying, togglePlayPause, playNewTrack } = useAudio();
	return (
		<div
			className={cn(
				'grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-10 xl:w-2/3',
				className
			)}
		>
			{tracks.map((track, i) => {
				const isCurrentTrack = currentTrack?.id === track.id;
				return (
					<div key={i}>
						<div
							className='rounded-lg block border overflow-hidden w-full h-auto mb-2 relative group cursor-pointer'
							onClick={() => {
								if (isCurrentTrack) {
									togglePlayPause();
								} else {
									playNewTrack(tracks, i);
								}
							}}
						>
							<div
								className={cn(
									'w-1/4 h-auto aspect-square flex justify-center items-center bg-white rounded-full absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 z-[1]',
									isCurrentTrack ? 'visible' : 'invisible',
									'group-hover:visible'
								)}
							>
								<PauseIcon
									className={cn(
										'w-3/5 h-auto aspect-square text-black fill-black ',
										!(isPlaying && isCurrentTrack) ? 'hidden' : 'block'
									)}
								/>

								<PlayIcon
									className={cn(
										'w-3/5 h-auto aspect-square text-black fill-black cursor-pointer',
										isPlaying && isCurrentTrack ? 'hidden' : 'block'
									)}
								/>
							</div>

							<Image
								src={track.cover}
								alt={track.title}
								width={220}
								height={220}
								className='w-full h-auto aspect-square object-cover cursor-pointer border-border '
							/>
						</div>

						<Link
							href={'/artists/id'}
							className='text-muted text-sm md:text-base font-semibold text-nowrap hover:text-primary'
						>
							{track.artist}
						</Link>
						<Link
							href={`/tracks/${track.id}`}
							className={cn(
								'text-white text-sm sm:text-[17px] font-semibold line-clamp-1 hover:underline'
							)}
						>
							{track.title}
						</Link>
						<h6 className='text-xs hidden md:block md:text-sm font-light text-muted line-clamp-1'>
							{track.genre}
						</h6>
					</div>
				);
			})}
		</div>
	);
}