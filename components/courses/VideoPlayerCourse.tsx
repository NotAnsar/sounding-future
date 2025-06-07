'use client';

import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import videojs from 'video.js';
import type Player from 'video.js/dist/types/player';
import 'video.js/dist/video-js.css';
import {
	updateChapterProgress,
	updateCourseProgress,
} from '@/actions/lms/course-progress';

// Extended Player interface to include controlBar
interface ExtendedPlayer extends Player {
	controlBar: {
		progressControl: {
			seekBar: {
				el(): HTMLElement;
			};
		};
	};
}

// Dummy markers data for demo - adjust timestamps for your video length
export const DUMMY_MARKERS = [
	{
		id: '1',
		timestamp: 0,
		title: 'Start',
		description: 'Beginning of the video',
	},
	{
		id: '2',
		timestamp: 30,
		title: 'Introduction',
		description: 'Quick intro section',
	},
	{
		id: '3',
		timestamp: 120,
		title: 'Main Point',
		description: 'Key concept explained',
	},
	{
		id: '4',
		timestamp: 240,
		title: 'Example',
		description: 'Demonstration or example',
	},
	{
		id: '5',
		timestamp: 360,
		title: 'Conclusion',
		description: 'Wrap up and ending',
	},
];

interface VideoMarker {
	id: string;
	timestamp: number;
	title: string;
	description: string;
}

interface VideoJSPlayerProps {
	src: string;
	poster?: string;
	title?: string;
	className?: string;
	onVideoEnd?: () => void;
	chapterId?: string;
	courseId?: string;
	isAuthenticated?: boolean;
	isPending?: boolean;
	onTimeUpdate?: (currentTime: number, duration: number) => void;
	onSeekToTime?: (seekFunction: (time: number) => void) => void;
	markers?: VideoMarker[];
}

export default function VideoPlayerCourse({
	src,
	poster,
	className,
	onVideoEnd,
	chapterId,
	courseId,
	isAuthenticated = false,
	isPending,
	onTimeUpdate,
	onSeekToTime,
	markers = DUMMY_MARKERS,
}: VideoJSPlayerProps) {
	const videoRef = useRef<HTMLDivElement>(null);
	const playerRef = useRef<Player | null>(null);

	const [duration, setDuration] = useState(0);
	const [showMarkersList, setShowMarkersList] = useState(false);
	const [isFullscreen, setIsFullscreen] = useState(false);
	const [fullscreenElement, setFullscreenElement] = useState<Element | null>(
		null
	);

	// Handle seeking from markers
	const handleSeek = (time: number) => {
		if (playerRef.current) {
			playerRef.current.currentTime(time);
		}
	};

	// Add markers to Video.js progress bar
	const addMarkersToProgressBar = (player: Player, markers: VideoMarker[]) => {
		const duration = player.duration();
		if (!duration || duration === 0) return;

		// Wait for the control bar to be ready
		player.ready(() => {
			// Type assertion with proper interface
			const extendedPlayer = player as ExtendedPlayer;
			const controlBar = extendedPlayer.controlBar;
			if (!controlBar) return;

			const progressControl = controlBar.progressControl;
			if (!progressControl) return;

			const seekBar = progressControl.seekBar;
			if (!seekBar) return;

			// Remove existing markers
			const existingMarkers = seekBar.el().querySelectorAll('.vjs-marker');
			existingMarkers.forEach((markerElement: Element) =>
				markerElement.remove()
			);

			// Add new markers
			markers.forEach((marker: VideoMarker) => {
				if (marker.timestamp <= duration) {
					const markerElement = document.createElement('div');
					markerElement.className = 'vjs-marker';
					markerElement.style.cssText = `
            position: absolute;
            top: 50%;
            width: 10px;
            height: 10px;
            background-color: #8A7BFF;
            border: 2px solid #8A7BFF;
            border-radius: 50%;
            cursor: pointer;
            z-index: 1;
            box-shadow: 0 2px 8px rgba(138, 123, 255, 0.6);
            left: ${(marker.timestamp / duration) * 100}%;
            transform: translate(-50%, -50%);
            transition: all 0.2s ease;
          `;

					// Add hover effect
					markerElement.addEventListener('mouseenter', () => {
						markerElement.style.transform = 'translate(-50%, -50%) scale(1.3)';
						markerElement.style.backgroundColor = '#8A7BFF';
					});

					markerElement.addEventListener('mouseleave', () => {
						markerElement.style.transform = 'translate(-50%, -50%) scale(1)';
						markerElement.style.backgroundColor = '#8A7BFF';
					});

					// Add tooltip
					const tooltip = document.createElement('div');
					tooltip.className = 'vjs-marker-tooltip';
					tooltip.style.cssText = `
            position: absolute;
            bottom: 120%;
            left: 50%;
            transform: translateX(-50%);
            background: #8A7BFF;
            color: white;
            padding: 8px;
            border-radius: 6px;
            font-size: 11px;
            white-space: nowrap;
            opacity: 0;
            pointer-events: none;
            transition: all 0.3s ease;
            z-index: 1000;
            min-width: 120px;
            max-width: 300px;
            width: max-content;
            white-space: normal;
            text-align: left;
          `;

					const timeString = `${Math.floor(marker.timestamp / 60)}:${String(
						Math.floor(marker.timestamp % 60)
					).padStart(2, '0')}`;
					tooltip.innerHTML = `
            <div style="font-weight: 600; font-size: 12px; margin-bottom: 2px;">${marker.title}</div>
            <div style="color: rgba(255, 255, 255, 0.9); font-size: 10px; margin-bottom: 3px;">${marker.description}</div>
            <div style="color: rgba(255, 255, 255, 0.8); font-size: 9px;">${timeString}</div>
          `;

					markerElement.appendChild(tooltip);

					// Add hover events for tooltip
					markerElement.addEventListener('mouseenter', () => {
						tooltip.style.opacity = '1';
						tooltip.style.transform = 'translateX(-50%) translateY(-4px)';
					});

					markerElement.addEventListener('mouseleave', () => {
						tooltip.style.opacity = '0';
						tooltip.style.transform = 'translateX(-50%) translateY(0)';
					});

					// Add click event
					markerElement.addEventListener('click', (e: Event) => {
						e.stopPropagation();
						player.currentTime(marker.timestamp);
					});

					seekBar.el().appendChild(markerElement);
				}
			});
		});
	};

	useEffect(() => {
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
				sources: [{ src: src, type: 'video/mp4' }],
				playbackRates: [0.5, 1, 1.25, 1.5, 2],
			});

			playerRef.current = player;

			// Track current time for markers
			player.on('timeupdate', () => {
				const currentTime = player.currentTime() || 0;
				const duration = player.duration() || 0;
				onTimeUpdate?.(currentTime, duration);
			});

			// Track duration and add markers
			player.on('loadedmetadata', () => {
				const duration = player.duration() || 0;
				setDuration(duration);
				onTimeUpdate?.(0, duration);

				// Add markers to progress bar
				setTimeout(() => {
					addMarkersToProgressBar(player, markers);
				}, 100);
			});

			// Handle fullscreen changes
			player.on('fullscreenchange', () => {
				const isNowFullscreen = !!document.fullscreenElement;
				setIsFullscreen(isNowFullscreen);
				setFullscreenElement(document.fullscreenElement);

				setTimeout(() => {
					addMarkersToProgressBar(player, markers);
				}, 100);
			});

			// Provide seek function to parent
			onSeekToTime?.(handleSeek);

			// Handle video start - update course and chapter progress
			player.on('play', async () => {
				if (!isAuthenticated || !chapterId || !courseId) return;

				// Update course progress to mark this chapter as current
				await updateCourseProgress(courseId, chapterId);

				// Update/create chapter progress (not completed)
				await updateChapterProgress(chapterId, false);
			});

			// Handle video end - mark chapter as completed
			player.on('ended', async () => {
				if (!isAuthenticated || !chapterId) return;

				// Mark chapter as completed
				await updateChapterProgress(chapterId, true);

				onVideoEnd?.();
			});
		}

		return () => {
			const player = playerRef.current;
			if (player && !player.isDisposed()) {
				player.dispose();
				playerRef.current = null;
			}
		};
	}, [
		src,
		poster,
		onVideoEnd,
		chapterId,
		courseId,
		isAuthenticated,
		onTimeUpdate,
		onSeekToTime,
		markers,
	]);

	// Filter markers that are within video duration
	const validMarkers = markers.filter(
		(marker: VideoMarker) => marker.timestamp <= duration
	);

	// Render markers list component
	const renderMarkersList = () => (
		<>
			{/* Markers List Toggle Button */}
			{validMarkers.length > 0 && (
				<button
					onClick={() => setShowMarkersList(!showMarkersList)}
					className='bg-black/70 hover:bg-black/80 text-white p-2 rounded-lg transition-colors'
					style={{
						position: 'fixed',
						top: '20px',
						right: '20px',
						zIndex: 9999,
					}}
					title='Show chapters'
				>
					<svg
						className='w-4 h-4'
						fill='none'
						stroke='currentColor'
						viewBox='0 0 24 24'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M4 6h16M4 12h16M4 18h16'
						/>
					</svg>
				</button>
			)}

			{/* Markers List */}
			{showMarkersList && validMarkers.length > 0 && (
				<div
					className='bg-black/90 rounded-lg p-3 max-w-xs'
					style={{
						position: 'fixed',
						top: '70px',
						right: '20px',
						zIndex: 9999,
					}}
				>
					<div className='flex justify-between items-center mb-2'>
						<h4 className='text-white font-semibold text-sm'>Chapters</h4>
						<button
							onClick={() => setShowMarkersList(false)}
							className='text-white/60 hover:text-white'
						>
							<svg
								className='w-4 h-4'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M6 18L18 6M6 6l12 12'
								/>
							</svg>
						</button>
					</div>
					<div className='space-y-1 max-h-64 overflow-y-auto'>
						{validMarkers.map((marker: VideoMarker) => (
							<button
								key={marker.id}
								onClick={() => {
									handleSeek(marker.timestamp);
									setShowMarkersList(false);
								}}
								className='w-full text-left text-white/80 hover:text-white text-xs py-2 px-2 rounded hover:bg-white/10 transition-colors'
							>
								<div className='flex justify-between items-start gap-2'>
									<div className='flex-1'>
										<div className='font-medium'>{marker.title}</div>
										<div className='text-white/60 mt-1'>
											{marker.description}
										</div>
									</div>
									<span className='text-blue-300 flex-shrink-0 text-xs'>
										{Math.floor(marker.timestamp / 60)}:
										{String(Math.floor(marker.timestamp % 60)).padStart(2, '0')}
									</span>
								</div>
							</button>
						))}
					</div>
				</div>
			)}
		</>
	);

	return (
		<div className='aspect-video relative w-full mt-2 rounded-2xl overflow-hidden border-2'>
			<div data-vjs-player className={cn(className)}>
				<div ref={videoRef} />
			</div>

			{/* Render in normal mode */}
			{!isFullscreen && (
				<>
					{/* Markers List Toggle Button */}
					{validMarkers.length > 0 && (
						<button
							onClick={() => setShowMarkersList(!showMarkersList)}
							className='absolute top-4 right-4 bg-black/70 hover:bg-black/80 text-white p-2 rounded-lg transition-colors z-10'
							title='Show chapters'
						>
							<svg
								className='w-4 h-4'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M4 6h16M4 12h16M4 18h16'
								/>
							</svg>
						</button>
					)}

					{/* Markers List */}
					{showMarkersList && validMarkers.length > 0 && (
						<div className='absolute top-16 right-4 bg-black/90 rounded-lg p-3 max-w-xs z-20'>
							<div className='flex justify-between items-center mb-2'>
								<h4 className='text-white font-semibold text-sm'>Chapters</h4>
								<button
									onClick={() => setShowMarkersList(false)}
									className='text-white/60 hover:text-white'
								>
									<svg
										className='w-4 h-4'
										fill='none'
										stroke='currentColor'
										viewBox='0 0 24 24'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M6 18L18 6M6 6l12 12'
										/>
									</svg>
								</button>
							</div>
							<div className='space-y-1 max-h-64 overflow-y-auto'>
								{validMarkers.map((marker: VideoMarker) => (
									<button
										key={marker.id}
										onClick={() => {
											handleSeek(marker.timestamp);
											setShowMarkersList(false);
										}}
										className='w-full text-left text-white/80 hover:text-white text-xs py-2 px-2 rounded hover:bg-white/10 transition-colors'
									>
										<div className='flex justify-between items-start gap-2'>
											<div className='flex-1'>
												<div className='font-medium'>{marker.title}</div>
												<div className='text-white/60 mt-1'>
													{marker.description}
												</div>
											</div>
											<span className='text-blue-300 flex-shrink-0 text-xs'>
												{Math.floor(marker.timestamp / 60)}:
												{String(Math.floor(marker.timestamp % 60)).padStart(
													2,
													'0'
												)}
											</span>
										</div>
									</button>
								))}
							</div>
						</div>
					)}
				</>
			)}

			{/* Render in fullscreen mode using portal */}
			{isFullscreen &&
				fullscreenElement &&
				createPortal(renderMarkersList(), fullscreenElement)}

			{/* Loading overlay during transition */}
			{isPending && (
				<div className='absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm z-10'>
					<div className='text-white text-center'>
						<div className='w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2' />
						<p className='text-sm'>Loading next chapter...</p>
					</div>
				</div>
			)}
		</div>
	);
}
