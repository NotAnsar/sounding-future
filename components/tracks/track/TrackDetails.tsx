'use client';

import Image from 'next/image';
import { PauseIcon, PlayIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAudio } from '@/context/AudioContext';
import Link from 'next/link';
import { Icons } from '@/components/icons/track-icons';
import { useState } from 'react';
import { Track } from '@/config/dummy-data';

export default function TrackDetails({ track }: { track: Track }) {
	const { currentTrack, isPlaying, togglePlayPause, playNewTrack } = useAudio();
	const [liked, setliked] = useState(track.liked);
	const isCurrentTrack = currentTrack?.id === track.id;

	return (
		<div className='w-full flex flex-col sm:flex-row  gap-4'>
			<div
				className={cn(
					'rounded-3xl border overflow-hidden relative group cursor-pointer w-full sm:min-w-64 sm:w-64 xl:min-w-72 xl:w-72  h-auto aspect-square'
				)}
				onClick={() => {
					if (isCurrentTrack) {
						togglePlayPause();
					} else {
						playNewTrack([track]);
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
							'w-3/5 h-auto aspect-square text-black fill-black cursor-pointer ',
							isPlaying && isCurrentTrack ? 'hidden' : 'block'
						)}
					/>
				</div>
				<Image alt={track.title} src={track.cover} width={640} height={640} />
			</div>
			<div className='flex flex-col gap-3 mt-auto mb-2'>
				<span
					className={cn(
						'text-xs px-2 py-1 rounded-sm uppercase font-medium text-white bg-primary-foreground w-fit'
					)}
				>
					Track
				</span>

				<div className='flex gap-3 flex-col xl:flex-row'>
					<h2 className='text-3xl sm:text-5xl xl:text-6xl font-bold'>
						{track.title}
					</h2>

					<div className='flex gap-3 items-center ml-auto sm:ml-0'>
						<div
							onClick={() => setliked((l) => !l)}
							className='cursor-pointer h-full flex justify-center items-center'
						>
							{liked ? (
								<Icons.heartFilled className='w-7 h-auto aspect-square fill-white ' />
							) : (
								<Icons.heartOutline className='w-7 h-auto aspect-square fill-white' />
							)}
						</div>
						<Icons.share className='w-6 h-auto aspect-square fill-white cursor-pointer' />
					</div>
				</div>

				<div className='flex gap-2.5 items-center'>
					<Image
						alt={track.artist.name}
						src={track.artist.picture}
						className='rounded-full w-8 sm:w-12 h-auto'
						width={48}
						height={48}
					/>
					<Link
						href={`/player/artist/${track.artist.id}`}
						className='text-lg sm:text-2xl font-semibold hover:underline cursor-pointer line-clamp-1 '
					>
						{track.artist.name}
					</Link>
					<Icons.follow className='min-w-7 w-7 h-auto aspect-square fill-white flex-nowrap text-nowrap cursor-pointer' />
				</div>
			</div>
		</div>
	);
}
