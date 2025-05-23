'use client';

import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useAudio } from '@/context/AudioContext';
import { PauseIcon, PlayIcon } from 'lucide-react';
import { PublicTrack } from '@/db/tracks';

export default function TracksCards({
	tracks,
	className,
	notFoundLabel = 'No tracks found',
}: {
	tracks: PublicTrack[];
	className?: string;
	notFoundLabel?: string;
}) {
	const { currentTrack, isPlaying, togglePlayPause, playNewTrack } = useAudio();

	return (
		<div
			className={cn(
				'grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4 sm:gap-x-6 sm:gap-y-10 2xl:gap-x-10 ',
				className
			)}
		>
			{tracks?.length === 0 && (
				<p className='text-base text-muted'>{notFoundLabel}</p>
			)}
			{tracks?.map((track, i) => {
				const isCurrentTrack = currentTrack?.id === track?.id;
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
							href={`/tracks/${track.slug}`}
							className='cursor-pointer group'
						>
							<h5 className='text-muted text-sm md:text-base font-semibold text-nowrap truncate '>
								{track?.artists?.map((artist) => artist.artist.name).join(', ')}
							</h5>
							<h4
								className={cn(
									'text-sm sm:text-[17px] font-semibold line-clamp-1 group-hover:text-trackTitle-hover-light dark:group-hover:text-trackTitle-hover-dark duration-200 transition-all',
									isCurrentTrack && isPlaying ? 'text-primary-foreground' : ''
								)}
							>
								{track?.title}
							</h4>
							<h6 className='text-xs hidden md:block md:text-sm font-light text-muted line-clamp-1'>
								{track?.genres?.map((genre) => genre.genre.name).join(', ')}
							</h6>
						</Link>
					</div>
				);
			})}
		</div>
	);
}
