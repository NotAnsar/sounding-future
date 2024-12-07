'use client';

import { useAudio } from '@/context/AudioContext';
import { PublicTrack } from '@/db/tracks';
import { cn } from '@/lib/utils';
import { PauseIcon, PlayIcon } from 'lucide-react';

export default function PlayTrack({
	tracks,
	index,
	isCurrentTrack = false,
}: {
	tracks: PublicTrack[];
	index?: number;
	isCurrentTrack: boolean;
}) {
	const { togglePlayPause, playNewTrack, isPlaying } = useAudio();
	return (
		<form>
			<button
				type='submit'
				onClick={() => {
					if (isCurrentTrack) {
						togglePlayPause();
					} else {
						playNewTrack(tracks, index);
					}
				}}
			>
				<div className='w-8 h-auto aspect-square flex justify-center items-center bg-white rounded-full'>
					<PauseIcon
						className={cn(
							'w-3/5 h-auto aspect-square text-black fill-black cursor-pointer ',
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
			</button>
		</form>
	);
}
