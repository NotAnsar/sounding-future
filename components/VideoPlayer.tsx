'use client';

import { cn } from '@/lib/utils';
import { useEffect, useRef } from 'react';
import videojs from 'video.js';
import type Player from 'video.js/dist/types/player';
import 'video.js/dist/video-js.css';

interface VideoJSPlayerProps {
	hlsUrl?: string;
	src: string;
	poster?: string;
	title?: string;
	className?: string;
	onVideoEnd?: () => void;
}

export default function VideoPlayer({
	src,
	hlsUrl,
	poster,
	className,
	onVideoEnd,
}: VideoJSPlayerProps) {
	const videoRef = useRef<HTMLDivElement>(null);
	const playerRef = useRef<Player | null>(null);

	useEffect(() => {
		if (!playerRef.current && videoRef.current) {
			const videoElement = document.createElement('video-js');
			videoElement.classList.add('vjs-big-play-centered');
			videoRef.current.appendChild(videoElement);

			// Build sources array - only include valid URLs
			const sources = [];

			// Add HLS source if available - USE PROXY TO BYPASS CORS
			if (hlsUrl) {
				const proxiedHlsUrl = `/api/hls-proxy?url=${encodeURIComponent(
					hlsUrl
				)}`;
				sources.push({ src: proxiedHlsUrl, type: 'application/x-mpegURL' });
			}

			if (src) {
				sources.push({ src, type: 'video/mp4' });
			}

			if (sources.length === 0) {
				console.error('❌ No video sources available');
				return;
			}

			// const player = videojs(videoElement, {
			// 	controls: true,
			// 	responsive: true,
			// 	fluid: true,
			// 	aspectRatio: '16:9',
			// 	poster: poster,
			// 	preload: 'metadata',
			// 	sources: [{ src: src, type: 'video/mp4' }],
			// 	playbackRates: [0.5, 1, 1.25, 1.5, 2],
			// });

			// playerRef.current = player;

			const player = videojs(videoElement, {
				controls: true,
				responsive: true,
				fluid: true,
				aspectRatio: '16:9',
				poster,
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

			// Handle video end - just call the callback
			player.on('ended', () => {
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
	}, [hlsUrl, src, poster, onVideoEnd]);

	return (
		<div data-vjs-player className={cn(className)}>
			<div ref={videoRef} />
		</div>
	);
}
