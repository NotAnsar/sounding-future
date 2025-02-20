'use client';
import Image from 'next/image';
import { Icons } from '../icons/audio-player';
import { useAudio } from '@/context/AudioContext';
import { useAudioKeyboardControls } from '@/hooks/useAudioKeyboardControls';
import CustomSlider from './CustomSlider';
import { cn, formatTime } from '@/lib/utils';

import AudioType from './AudioType';
import AudioVolume from './AudioVolume';
import { LoaderCircle } from 'lucide-react';

export default function AudioPlayer() {
	const {
		currentTrack,
		isPlaying,
		currentTime,
		duration,
		togglePlayPause,
		seek,
		nextTrack,
		previousTrack,
		isLoop,
		toggleLoop,
		isLoading,
	} = useAudio();

	useAudioKeyboardControls();

	if (!currentTrack) return null;

	return (
		<div className='w-full dark:bg-player bg-[#dadafa] fixed bottom-0 py-3 px-4 md:px-5 flex items-center justify-between gap-2 z-10 '>
			<div className='flex gap-3 items-center w-auto md:min-w-[200px] xl:min-w-[250px] max-w-[250px] md:w-[250px]'>
				<Image
					src={currentTrack.cover}
					alt='cover'
					width={56}
					height={56}
					className='rounded-md w-14 h-14 aspect-square object-cover'
				/>
				<div className='truncate hidden md:block'>
					<h2 className='font-semibold truncate'>{currentTrack.title}</h2>
					<h5 className='text-sm text-muted font-semibold'>
						{currentTrack.artist.name}
					</h5>
				</div>
			</div>

			<div className='flex gap-2 md:gap-3 items-center justify-center w-full '>
				<div className='flex gap-1.5 items-center '>
					<Icons.next
						className='w-8 h-auto aspect-square cursor-pointer rotate-180 hidden sm:block fill-foreground'
						onClick={previousTrack}
					/>
					<button onClick={togglePlayPause} className='text-nowrap'>
						{isLoading ? (
							<div className='w-12 h-auto aspect-square bg-foreground rounded-full flex justify-center items-center'>
								<LoaderCircle className='w-6 h-auto aspect-square text-background animate-spin stroke-2' />
							</div>
						) : isPlaying ? (
							<Icons.pause className='w-12 h-auto aspect-square text-foreground fill-foreground cursor-pointer' />
						) : (
							<Icons.play className='w-12 h-auto aspect-square cursor-pointer text-foreground fill-foreground ' />
						)}
					</button>

					<Icons.next
						className='w-8 h-auto aspect-square cursor-pointer hidden sm:block fill-foreground'
						onClick={nextTrack}
					/>
				</div>
				<div className='flex gap-2 md:gap-3 items-center w-full xl:w-auto'>
					<span className='text-xs font-semibold w-8'>
						{/* {isLoading ? '--:--' : formatTime(currentTime)} */}
						{formatTime(currentTime) || '--:--'}
					</span>

					<CustomSlider
						min={0}
						step={0.01}
						max={duration}
						value={currentTime}
						onChange={(e) => seek(parseFloat(e.target.value))}
						className='w-full xl:w-[400px]'
					/>

					<span className='text-xs font-semibold w-8'>
						{formatTime(duration)}
					</span>
				</div>
				<div
					className={cn(
						' w-10 h-auto aspect-square justify-center items-center border-2  rounded-full hidden lg:flex cursor-pointer transition-all duration-200',
						isLoop ? 'bg-foreground' : 'border-foreground'
					)}
					onClick={toggleLoop}
				>
					<Icons.shuffle
						className={cn(
							'w-4 h-auto cursor-pointer transition-all duration-200',
							isLoop ? 'text-background' : 'text-foreground'
						)}
					/>
				</div>
			</div>

			<div className='gap-3 items-center flex ml-auto'>
				<AudioType />
				<AudioVolume />
			</div>
		</div>
	);
}
