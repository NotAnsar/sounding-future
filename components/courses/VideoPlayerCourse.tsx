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
	onVideoEnd?: () => void;
}

export default function VideoPlayerCourse({
	src,
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

			// Handle video end
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
	}, [src, poster, onVideoEnd]);

	return (
		<div data-vjs-player className={cn(className)}>
			<div ref={videoRef} />
		</div>
	);
}
