// 'use client';

// import React, { useState, useRef, useEffect } from 'react';
// import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';
// import { cn } from '@/lib/utils';

// interface VideoPlayerProps {
// 	src: string;
// 	poster?: string;
// 	title?: string;
// 	className?: string;
// }

// export default function VideoPlayer({
// 	src,
// 	poster,

// 	className,
// }: VideoPlayerProps) {
// 	const videoRef = useRef<HTMLVideoElement>(null);
// 	const [isPlaying, setIsPlaying] = useState(false);
// 	const [currentTime, setCurrentTime] = useState(0);
// 	const [duration, setDuration] = useState(0);

// 	const [isMuted, setIsMuted] = useState(false);
// 	const [showControls, setShowControls] = useState(true);

// 	useEffect(() => {
// 		const video = videoRef.current;
// 		if (!video) return;

// 		const updateTime = () => setCurrentTime(video.currentTime);
// 		const updateDuration = () => setDuration(video.duration);

// 		video.addEventListener('timeupdate', updateTime);
// 		video.addEventListener('loadedmetadata', updateDuration);
// 		video.addEventListener('ended', () => setIsPlaying(false));

// 		return () => {
// 			video.removeEventListener('timeupdate', updateTime);
// 			video.removeEventListener('loadedmetadata', updateDuration);
// 			video.removeEventListener('ended', () => setIsPlaying(false));
// 		};
// 	}, []);

// 	const togglePlay = () => {
// 		const video = videoRef.current;
// 		if (!video) return;

// 		if (isPlaying) {
// 			video.pause();
// 		} else {
// 			video.play();
// 		}
// 		setIsPlaying(!isPlaying);
// 	};

// 	const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
// 		const video = videoRef.current;
// 		if (!video || !duration) return;

// 		const rect = e.currentTarget.getBoundingClientRect();
// 		const percent = (e.clientX - rect.left) / rect.width;
// 		const newTime = percent * duration;
// 		video.currentTime = newTime;
// 	};

// 	const toggleMute = () => {
// 		const video = videoRef.current;
// 		if (!video) return;

// 		video.muted = !isMuted;
// 		setIsMuted(!isMuted);
// 	};

// 	const toggleFullscreen = () => {
// 		const video = videoRef.current;
// 		if (!video) return;

// 		if (document.fullscreenElement) {
// 			document.exitFullscreen();
// 		} else {
// 			video.requestFullscreen();
// 		}
// 	};

// 	const formatTime = (time: number) => {
// 		const minutes = Math.floor(time / 60);
// 		const seconds = Math.floor(time % 60);
// 		return `${minutes}:${seconds.toString().padStart(2, '0')}`;
// 	};

// 	const progressPercent = duration ? (currentTime / duration) * 100 : 0;

// 	return (
// 		<div
// 			className={cn(
// 				'relative group bg-black rounded-lg overflow-hidden',
// 				className
// 			)}
// 			onMouseEnter={() => setShowControls(true)}
// 			onMouseLeave={() => setShowControls(false)}
// 		>
// 			<video
// 				ref={videoRef}
// 				src={src}
// 				poster={poster}
// 				className='w-full h-full object-cover cursor-pointer'
// 				onClick={togglePlay}
// 			/>

// 			{/* Play button overlay */}
// 			{!isPlaying && (
// 				<div className='absolute inset-0 flex items-center justify-center'>
// 					<button
// 						onClick={togglePlay}
// 						className='bg-white/20 hover:bg-white/30 rounded-full p-6 transition-all backdrop-blur-sm'
// 					>
// 						<Play className='w-8 h-8 text-white ml-1' />
// 					</button>
// 				</div>
// 			)}

// 			{/* Controls */}
// 			<div
// 				className={cn(
// 					'absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300',
// 					showControls ? 'opacity-100' : 'opacity-0'
// 				)}
// 			>
// 				{/* Progress bar */}
// 				<div
// 					className='w-full h-1 bg-white/30 rounded-full cursor-pointer mb-3'
// 					onClick={handleSeek}
// 				>
// 					<div
// 						className='h-full bg-primary rounded-full'
// 						style={{ width: `${progressPercent}%` }}
// 					/>
// 				</div>

// 				{/* Control buttons */}
// 				<div className='flex items-center justify-between'>
// 					<div className='flex items-center space-x-3'>
// 						<button
// 							onClick={togglePlay}
// 							className='text-white hover:text-primary transition-colors'
// 						>
// 							{isPlaying ? (
// 								<Pause className='w-5 h-5' />
// 							) : (
// 								<Play className='w-5 h-5' />
// 							)}
// 						</button>

// 						<button
// 							onClick={toggleMute}
// 							className='text-white hover:text-primary transition-colors'
// 						>
// 							{isMuted ? (
// 								<VolumeX className='w-4 h-4' />
// 							) : (
// 								<Volume2 className='w-4 h-4' />
// 							)}
// 						</button>

// 						<span className='text-white text-sm'>
// 							{formatTime(currentTime)} / {formatTime(duration)}
// 						</span>
// 					</div>

// 					<button
// 						onClick={toggleFullscreen}
// 						className='text-white hover:text-primary transition-colors'
// 					>
// 						<Maximize className='w-4 h-4' />
// 					</button>
// 				</div>
// 			</div>
// 		</div>
// 	);
// }

'use client';

import { cn } from '@/lib/utils';
import { useEffect, useRef } from 'react';
import videojs from 'video.js';
import type Player from 'video.js/dist/types/player';
import 'video.js/dist/video-js.css';

interface VideoJSPlayerProps {
	src: string;
	poster?: string;
	title?: string;
	className?: string;
}

export default function VideoPlayer({
	src,
	poster,
	className,
}: VideoJSPlayerProps) {
	const videoRef = useRef<HTMLDivElement>(null);
	const playerRef = useRef<Player | null>(null);

	useEffect(() => {
		// Make sure Video.js player is only initialized once
		if (!playerRef.current && videoRef.current) {
			const videoElement = document.createElement('video-js');

			videoElement.classList.add('vjs-big-play-centered');
			videoRef.current.appendChild(videoElement);

			const player = videojs(videoElement, {
				controls: true,
				responsive: true,
				fluid: true,
				aspectRatio: '16:9',
				poster: poster,
				preload: 'metadata',
				sources: [
					{
						src: src,
						type: 'video/mp4',
					},
				],
				playbackRates: [0.5, 1, 1.25, 1.5, 2],
			});

			playerRef.current = player;

			// Add custom styling
			player.ready(() => {
				player.addClass('vjs-custom-skin');
			});
		}

		return () => {
			const player = playerRef.current;
			if (player && !player.isDisposed()) {
				player.dispose();
				playerRef.current = null;
			}
		};
	}, [src, poster]);

	return (
		<div data-vjs-player className={cn(className)}>
			<div ref={videoRef} />
		</div>
	);
}
