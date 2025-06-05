'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface VideoMarker {
	id: string;
	timestamp: number; // in seconds
	title: string;
	description?: string;
}

interface VideoMarkerBarProps {
	markers: VideoMarker[];
	videoDuration: number;
	currentTime: number;
	onSeek: (time: number) => void;
	className?: string;
}

export default function VideoMarkerBar({
	markers,
	videoDuration,
	currentTime,
	onSeek,
	className,
}: VideoMarkerBarProps) {
	const [hoveredMarker, setHoveredMarker] = useState<VideoMarker | null>(null);
	const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	};

	const handleMarkerHover = (marker: VideoMarker, event: React.MouseEvent) => {
		setHoveredMarker(marker);
		const rect = (event.target as HTMLElement).getBoundingClientRect();
		setTooltipPosition({
			x: rect.left + rect.width / 2,
			y: rect.top - 10,
		});
	};

	const handleMarkerClick = (timestamp: number) => {
		onSeek(timestamp);
	};

	if (!markers.length || videoDuration === 0) return null;

	return (
		<div className={cn('relative', className)}>
			{/* Progress bar background */}
			<div className='w-full h-3 bg-gray-300 dark:bg-gray-700 rounded-full relative overflow-visible mb-6'>
				{/* Current progress */}
				<div
					className='h-full bg-blue-500 rounded-full transition-all duration-300'
					style={{ width: `${(currentTime / videoDuration) * 100}%` }}
				/>

				{/* Markers */}
				{markers.map((marker) => {
					const position = (marker.timestamp / videoDuration) * 100;
					const isActive = Math.abs(currentTime - marker.timestamp) < 1;

					return (
						<button
							key={marker.id}
							type='button'
							className={cn(
								'absolute top-1/2 w-4 h-4 rounded-full border-2 transition-all duration-200 hover:scale-125 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer z-10',
								isActive
									? 'bg-red-500 border-red-600 shadow-lg scale-125 animate-pulse'
									: 'bg-yellow-400 border-yellow-500 hover:bg-yellow-300 shadow-md'
							)}
							style={{
								left: `${position}%`,
								transform: `translateX(-50%) translateY(-50%)`,
							}}
							onClick={() => handleMarkerClick(marker.timestamp)}
							onMouseEnter={(e) => handleMarkerHover(marker, e)}
							onMouseLeave={() => setHoveredMarker(null)}
							title={`${marker.title} - ${formatTime(marker.timestamp)}`}
						/>
					);
				})}
			</div>

			{/* Chapter list below the bar */}
			<div className='mt-4 space-y-2'>
				<h5 className='text-sm font-medium text-gray-700 dark:text-gray-300'>
					Video Chapters:
				</h5>
				{markers.map((marker) => {
					const isActive = Math.abs(currentTime - marker.timestamp) < 1;
					return (
						<button
							key={`list-${marker.id}`}
							onClick={() => handleMarkerClick(marker.timestamp)}
							className={cn(
								'flex items-center gap-3 w-full text-left p-3 rounded-lg transition-colors border',
								isActive
									? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700'
									: 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
							)}
						>
							<span className='text-xs text-blue-600 dark:text-blue-400 font-mono min-w-[45px] bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded'>
								{formatTime(marker.timestamp)}
							</span>
							<div className='flex-1'>
								<span
									className={cn(
										'text-sm block',
										isActive
											? 'text-blue-700 dark:text-blue-300 font-medium'
											: 'text-gray-700 dark:text-gray-300'
									)}
								>
									{marker.title}
								</span>
								{marker.description && (
									<span className='text-xs text-gray-500 dark:text-gray-400'>
										{marker.description}
									</span>
								)}
							</div>
							{isActive && (
								<div className='w-2 h-2 bg-red-500 rounded-full animate-pulse' />
							)}
						</button>
					);
				})}
			</div>

			{/* Hover Tooltip */}
			{hoveredMarker && (
				<div
					className='fixed z-50 bg-black text-white rounded-lg shadow-xl p-3 max-w-xs pointer-events-none'
					style={{
						left: tooltipPosition.x,
						top: tooltipPosition.y,
						transform: 'translateX(-50%) translateY(-100%)',
					}}
				>
					<div className='text-sm font-medium'>{hoveredMarker.title}</div>
					<div className='text-xs text-gray-300 mt-1'>
						{formatTime(hoveredMarker.timestamp)}
					</div>
					{hoveredMarker.description && (
						<div className='text-xs text-gray-300 mt-1'>
							{hoveredMarker.description}
						</div>
					)}
				</div>
			)}
		</div>
	);
}
