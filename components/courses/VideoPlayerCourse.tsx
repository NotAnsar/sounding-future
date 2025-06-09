'use client';

import { cn } from '@/lib/utils';
import { useEffect, useRef } from 'react';
import videojs from 'video.js';
import type Player from 'video.js/dist/types/player';
import 'video.js/dist/video-js.css';
import '@videojs/http-streaming';
import 'hls.js';
import {
	updateChapterProgress,
	updateCourseProgress,
} from '@/actions/lms/course-progress';
import { CourseDetailsWithMarkers } from '@/db/course';

// Extended Player interface to include controlBar
interface ExtendedPlayer extends Player {
	controlBar: { progressControl: { seekBar: { el(): HTMLElement } } };
}

type VideoMarker =
	CourseDetailsWithMarkers['chapters'][number]['markers'][number];

interface VideoJSPlayerProps {
	className?: string;
	onVideoEnd?: () => void;
	isAuthenticated?: boolean;
	isPending?: boolean;
	onTimeUpdate?: (currentTime: number, duration: number) => void;
	onSeekToTime?: (seekFunction: (time: number) => void) => void;
	currentChapter: CourseDetailsWithMarkers['chapters'][number];
}

export default function VideoPlayerCourse({
	currentChapter,
	onVideoEnd,
	onTimeUpdate,
	onSeekToTime,
	isAuthenticated = false,
	isPending,
	className,
}: VideoJSPlayerProps) {
	const { courseId, id: chapterId } = currentChapter;
	const videoRef = useRef<HTMLDivElement>(null);
	const playerRef = useRef<Player | null>(null);

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

			// Build sources array - only include valid URLs
			const sources = [];

			// Add HLS source if available - USE PROXY TO BYPASS CORS
			if (currentChapter?.hlsUrl) {
				const proxiedHlsUrl = `/api/hls-proxy?url=${encodeURIComponent(
					currentChapter.hlsUrl
				)}`;
				sources.push({
					src: proxiedHlsUrl,
					type: 'application/x-mpegURL',
				});
				console.log('🎬 Added proxied HLS source:', proxiedHlsUrl);
				console.log('🔗 Original HLS URL:', currentChapter.hlsUrl);
			}

			// Add MP4 source if available
			if (currentChapter?.videoUrl) {
				sources.push({
					src: currentChapter.videoUrl,
					type: 'video/mp4',
				});
				console.log('🎥 Added MP4 source:', currentChapter.videoUrl);
			}

			// Don't create player if no sources
			if (sources.length === 0) {
				console.error('❌ No video sources available');
				return;
			}

			console.log('🚀 Creating player with sources:', sources);

			const player = videojs(videoElement, {
				controls: true,
				responsive: true,
				fluid: true,
				aspectRatio: '16:9',
				poster: currentChapter?.thumbnail,
				preload: 'metadata',
				sources: sources,
				playbackRates: [0.5, 1, 1.25, 1.5, 2],
				html5: {
					hls: {
						enableLowInitialPlaylist: true,
						smoothQualityChange: true,
						overrideNative: true,
						withCredentials: false,
						handleManifestRedirects: true,
					},
					vhs: {
						enableLowInitialPlaylist: true,
						smoothQualityChange: true,
						overrideNative: true,
					},
				},
				techOrder: ['html5'],
			});

			playerRef.current = player;

			// Add comprehensive error handling
			player.on('error', () => {
				const errorObj = player.error();
				console.error('🔍 Error details:', errorObj);

				if (errorObj) {
					console.error('📋 Error code:', errorObj.code);
					console.error('📋 Error message:', errorObj.message);
				}

				// Log current source being tried
				const currentSrc = player.currentSrc();
				console.error('🎯 Current source:', currentSrc);
			});

			// Log when sources change
			player.on('loadstart', () => {
				const currentSrc = player.currentSrc();
				console.log('📺 Loading source:', currentSrc);
			});

			// Log successful load
			player.on('loadeddata', () => {
				const currentSrc = player.currentSrc();
				console.log('✅ Successfully loaded:', currentSrc);
			});

			player.ready(() => {
				player.el().addEventListener('contextmenu', (e) => {
					e.preventDefault();
					return false;
				});
			});

			// Track current time for markers
			player.on('timeupdate', () => {
				const currentTime = player.currentTime() || 0;
				const duration = player.duration() || 0;
				onTimeUpdate?.(currentTime, duration);
			});

			// Track duration and add markers
			player.on('loadedmetadata', () => {
				const duration = player.duration() || 0;
				onTimeUpdate?.(0, duration);

				// Add markers to progress bar
				setTimeout(() => {
					addMarkersToProgressBar(player, currentChapter.markers);
				}, 100);
			});

			// Handle fullscreen changes
			player.on('fullscreenchange', () => {
				setTimeout(() => {
					addMarkersToProgressBar(player, currentChapter.markers);
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
		onVideoEnd,
		chapterId,
		courseId,
		isAuthenticated,
		onTimeUpdate,
		onSeekToTime,
		currentChapter,
	]);

	// Show message if no video sources
	if (!currentChapter?.videoUrl && !currentChapter?.hlsUrl) {
		return (
			<div className='aspect-video relative w-full rounded-lg overflow-hidden border-2 bg-gray-100 flex items-center justify-center'>
				<div className='text-center text-gray-500'>
					<div className='text-lg font-medium mb-2'>No video available</div>
					<div className='text-sm'>
						{"This chapter doesn't have a video yet."}
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className='aspect-video relative w-full rounded-lg overflow-hidden border-2'>
			<div data-vjs-player className={cn(className)}>
				<div ref={videoRef} />
			</div>

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
