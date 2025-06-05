'use client';

import { cn } from '@/lib/utils';
import { useEffect, useRef /* useState */ } from 'react';
import videojs from 'video.js';
import type Player from 'video.js/dist/types/player';
import 'video.js/dist/video-js.css';
import {
	updateChapterProgress,
	updateCourseProgress,
} from '@/actions/lms/course-progress';
// import VideoMarkerBar from './course-details/VideoMarkerBar';

// // Dummy markers data for demo - adjust timestamps for your video length
// const DUMMY_MARKERS = [
// 	{
// 		id: '1',
// 		timestamp: 0,
// 		title: 'Start',
// 		description: 'Beginning of the video',
// 	},
// 	{
// 		id: '2',
// 		timestamp: 2,
// 		title: 'Introduction',
// 		description: 'Quick intro section',
// 	},
// 	{
// 		id: '3',
// 		timestamp: 4,
// 		title: 'Main Point',
// 		description: 'Key concept explained',
// 	},
// 	{
// 		id: '4',
// 		timestamp: 6,
// 		title: 'Example',
// 		description: 'Demonstration or example',
// 	},
// 	{
// 		id: '5',
// 		timestamp: 8,
// 		title: 'Conclusion',
// 		description: 'Wrap up and ending',
// 	},
// ];

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
	showMarkers?: boolean; // Option to show/hide markers
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
}: VideoJSPlayerProps) {
	const videoRef = useRef<HTMLDivElement>(null);
	const playerRef = useRef<Player | null>(null);

	// // State for markers
	// const [currentTime, setCurrentTime] = useState(0);
	// const [duration, setDuration] = useState(0);
	// const [markersVisible, setMarkersVisible] = useState(showMarkers);

	// // Handle seeking from markers
	// const handleSeek = (time: number) => {
	// 	if (playerRef.current) {
	// 		playerRef.current.currentTime(time);
	// 	}
	// };

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

			// // Track current time for markers
			// player.on('timeupdate', () => {
			// 	setCurrentTime(player.currentTime() || 0);
			// });

			// // Track duration for markers
			// player.on('loadedmetadata', () => {
			// 	setDuration(player.duration() || 0);
			// });

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
		<div className='space-y-4'>
			{/* Video Player Container */}
			<div className='aspect-video relative w-full mt-2 rounded-2xl overflow-hidden border-2'>
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

			{/* {showMarkers && duration > 0 && (
				<div className='space-y-3'>
					<div className='flex items-center justify-between'>
						<h4 className='text-sm font-medium'>
							Video Timeline ({Math.round(duration)}s) - Current:{' '}
							{Math.round(currentTime)}s
						</h4>
						<button
							onClick={() => setMarkersVisible(!markersVisible)}
							className='text-xs text-muted-foreground hover:text-foreground transition-colors'
						>
							{markersVisible ? 'Hide' : 'Show'} Markers
						</button>
					</div>

					{markersVisible && (
						<div className='bg-secondary/30 rounded-lg p-4'>
							<VideoMarkerBar
								markers={DUMMY_MARKERS}
								videoDuration={duration}
								currentTime={currentTime}
								onSeek={handleSeek}
							/>
						</div>
					)}
				</div>
			)} */}
		</div>
	);
}
