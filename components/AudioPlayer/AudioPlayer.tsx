'use client';
import Image from 'next/image';

import { Icons } from '../icons/audio-player';
import { Track, useAudio } from '@/context/AudioContext';
import { useAudioKeyboardControls } from '@/hooks/useAudioKeyboardControls';
import { useEffect } from 'react';
import CustomSlider from './CustomSlider';
import { formatTime } from '@/lib/utils';

export default function AudioPlayer() {
	const {
		currentTrack,
		isPlaying,
		currentTime,
		duration,
		volume,
		isMuted,
		togglePlayPause,
		setVolume,
		seek,
		playTrack,
		toggleMute,
	} = useAudio();
	useAudioKeyboardControls();

	useEffect(() => {
		if (!currentTrack) playTrack(track);
	}, [currentTrack, playTrack]);

	return (
		<div className='w-full bg-[#18243B] fixed bottom-0 py-3 px-4 flex items-center justify-between gap-2'>
			<div className='flex gap-3 items-center w-auto md:min-w-[200px] xl:min-w-[250px] max-w-[250px] md:w-[250px]'>
				<Image
					src='/cover.png'
					alt='cover'
					width={56}
					height={56}
					className='rounded-md'
				/>
				<div className='truncate hidden md:block'>
					<h2 className='font-semibold truncate'>{track.title}</h2>
					<h5 className='text-sm text-[#9898A6] font-semibold'>
						{track.artist}
					</h5>
				</div>
			</div>

			<div className='flex gap-3 items-center justify-center w-full '>
				<button onClick={togglePlayPause} className='text-nowrap'>
					{isPlaying ? (
						<Icons.pause className='w-14 h-auto aspect-square cursor-pointer' />
					) : (
						<Icons.play className='w-14 h-auto aspect-square cursor-pointer' />
					)}
				</button>
				<div className='flex gap-3 items-center w-full xl:w-auto'>
					<span className='text-xs font-semibold w-8'>
						{formatTime(currentTime)}
					</span>

					<CustomSlider
						min={0}
						step={0.01}
						max={duration}
						value={currentTime}
						onChange={(e) => seek(parseFloat(e.target.value))}
						className='w-full xl:w-[500px]'
					/>

					<span className='text-xs font-semibold w-8'>
						{formatTime(track.duration || 0)}
					</span>
				</div>
				<div className='w-10 h-auto aspect-square justify-center items-center bg-white rounded-full hidden md:flex '>
					<Icons.shuffle className='w-4 h-auto cursor-pointer text-black' />
				</div>
			</div>

			<div className='hidden gap-3 items-center mr-4 md:flex'>
				<Icons.setting className='w-5 h-auto aspect-square cursor-pointer' />
				<button onClick={toggleMute}>
					{isMuted ? (
						<Icons.muted className='w-[26px] h-auto aspect-square cursor-pointer' />
					) : (
						<Icons.speaker className='w-[26px] h-auto aspect-square cursor-pointer' />
					)}
				</button>

				<CustomSlider
					max={1}
					step={0.1}
					value={volume}
					onChange={(e) => setVolume(parseFloat(e.target.value))}
					className='w-[100px]'
				/>
				<Icons.info className='w-[22px] h-auto aspect-square cursor-pointer' />
			</div>
		</div>
	);
}

const track: Track = {
	id: '1',
	title: 'Cyber Flux',
	artist: 'Diego Fernandez',
	album: 'After Hours',
	releaseDate: '20/03/2020',
	genre: 'R&B, Synth-pop',
	duration: 361,
	label: 'XO, Republic Records',
	songUrl:
		'https://oekyfpijfizbaexjkhbg.supabase.co/storage/v1/object/public/music/The%20Weeknd%20-%20After%20Hours%20(Audio).mp3',
};
