'use client';

import { cn } from '@/lib/utils';
import { useEffect, useRef } from 'react';
import videojs from 'video.js';
import type Player from 'video.js/dist/types/player';
import 'video.js/dist/video-js.css';
import {
	updateChapterProgress,
	updateCourseProgress,
} from '@/actions/lms/course-progress';

interface VideoJSPlayerProps {
	src: string;
	poster?: string;
	title?: string;
	className?: string;
	onVideoEnd?: () => void;
	chapterId?: string;
	courseId?: string;
	isAuthenticated?: boolean;
}

export default function VideoPlayerCourse({
	src,
	poster,
	className,
	onVideoEnd,
	chapterId,
	courseId,
	isAuthenticated = false,
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
	}, [src, poster, onVideoEnd, chapterId, courseId, isAuthenticated]);

	return (
		<div data-vjs-player className={cn(className)}>
			<div ref={videoRef} />
		</div>
	);
}
