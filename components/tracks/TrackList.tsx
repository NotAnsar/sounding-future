'use client';
import { cn, formatTime } from '@/lib/utils';
import { Heart, PauseIcon } from 'lucide-react';
import Image from 'next/image';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';

import { PlayIcon } from 'lucide-react';
import { Track, useAudio } from '@/context/AudioContext';
import Link from 'next/link';

export default function TrackList({
	tracks,
	className,
}: {
	tracks: Track[];
	className?: string;
}) {
	const { currentTrack, isPlaying, togglePlayPause, playNewTrack } = useAudio();
	return (
		<div className={cn('p-4', className)}>
			<Table className='lg:w-2/3 '>
				<TableBody>
					{tracks.map((track, index) => {
						const isCurrentTrack = currentTrack?.id === track.id;
						return (
							<TableRow
								key={index}
								className={cn(
									'hover:bg-player/35 border-none group',
									isCurrentTrack ? 'bg-player/35' : ''
								)}
							>
								<TableCell className='w-14 relative'>
									<div
										className={cn(
											'min-w-14 max-w-14 h-auto aspect-square object-cover border border-border rounded-md justify-center items-center flex absolute inset-2 bg-black/40 cursor-pointer',
											// isPlaying && isCurrentTrack ? 'flex' : ''
											isCurrentTrack ? 'visible' : 'invisible',
											'group-hover:visible'
										)}
										onClick={() => {
											if (isCurrentTrack) {
												togglePlayPause();
											} else {
												playNewTrack(tracks, index);
											}
										}}
									>
										<div className='w-8 h-auto aspect-square flex justify-center items-center bg-white rounded-full'>
											{/* {isPlaying && isCurrentTrack ? (
												<PauseIcon className='w-5 h-auto aspect-square text-black fill-black cursor-pointer' />
											) : (
												<PlayIcon className='w-5 h-auto aspect-square text-black fill-black cursor-pointer' />
											)} */}
											<PauseIcon
												className={cn(
													'w-3/5 h-auto aspect-square text-black fill-black cursor-pointer ',
													!(isPlaying && isCurrentTrack) ? 'hidden' : 'block'
												)}
											/>

											<PlayIcon
												className={cn(
													'w-3/5 h-auto aspect-square text-black fill-black cursor-pointer',
													isPlaying && isCurrentTrack ? 'hidden' : 'block'
												)}
											/>
										</div>
									</div>

									<Image
										src={track.cover}
										alt={track.title}
										width={56}
										height={56}
										className=' min-w-14 max-w-14 h-auto aspect-square object-cover border border-border rounded-md '
									/>
								</TableCell>
								<TableCell className=''>
									<Link
										href={`/tracks/${track.id}`}
										className={cn(
											'text-white text-base font-semibold line-clamp-1 hover:opacity-80',
											isCurrentTrack ? 'text-primary' : ''
										)}
									>
										{track.title}
									</Link>
									<h6 className='text-sm font-light text-muted line-clamp-1 hidden sm:block'>
										{track.genre}
									</h6>
									<Link
										href={'/artist/id'}
										className='text-sm font-medium text-muted line-clamp-1 sm:hidden block hover:underline'
									>
										{track.artist}
									</Link>
								</TableCell>
								<TableCell className='hidden sm:block'>
									<Link
										href={'/artist/id'}
										className='text-muted text-base font-semibold text-nowrap hover:text-primary'
									>
										{track.artist}
									</Link>
								</TableCell>

								<TableCell>
									<Heart
										className={cn(
											'w-5 h-5 text-muted hover:text-white cursor-pointer',
											track.liked ? 'text-white fill-white' : ''
										)}
									/>
								</TableCell>

								<TableCell className='text-right pr-4'>
									{formatTime(track.duration)}
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</div>
	);
}
