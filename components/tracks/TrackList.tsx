'use client';

import { cn, formatTime } from '@/lib/utils';
import { PauseIcon } from 'lucide-react';
import Image from 'next/image';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { PlayIcon } from 'lucide-react';
import { useAudio } from '@/context/AudioContext';
import Link from 'next/link';
import { PublicTrackWithLikeStatus } from '@/db/tracks';
import LikeForm from '../LikeForm';

export default function TrackList({
	tracks,
	className,
	notFoundLabel = 'No tracks found',
}: {
	tracks: PublicTrackWithLikeStatus[];
	className?: string;
	notFoundLabel?: string;
}) {
	const { currentTrack, isPlaying, togglePlayPause, playNewTrack } = useAudio();
	return (
		<div className={cn('p-4 lg:w-2/3', className)}>
			<Table>
				<TableBody>
					{tracks?.length === 0 && (
						<p className='text-base text-muted'>{notFoundLabel}</p>
					)}
					{tracks?.map((track, index) => {
						const isCurrentTrack = currentTrack?.id === track?.id;
						return (
							<TableRow
								key={index}
								className={cn(
									'hover:bg-player/50 border-none group',
									isCurrentTrack ? 'bg-player/50' : ''
								)}
							>
								<TableCell className='w-14 relative'>
									<div
										className={cn(
											'min-w-14 max-w-14 h-auto aspect-square object-cover border border-border rounded-md justify-center items-center flex absolute inset-2 bg-black/40 cursor-pointer',
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
										src={track?.cover}
										alt={track?.title}
										width={56}
										height={56}
										className=' min-w-14 max-w-14 h-auto aspect-square object-cover border border-border rounded-md '
									/>
								</TableCell>
								<TableCell className=''>
									<Link
										href={`/tracks/${track?.slug}`}
										className={cn(
											' text-base font-semibold line-clamp-1 hover:opacity-80',
											isCurrentTrack ? 'text-primary-foreground' : ''
										)}
									>
										{track?.title}
									</Link>
									<h6 className='text-sm font-light text-muted line-clamp-1 hidden sm:block'>
										{track?.genres?.map((genre) => genre.genre.name).join(', ')}
									</h6>
									<div className='text-sm font-medium text-muted line-clamp-1 sm:hidden block'>
										{track?.artists?.map((artist, artistIndex) => (
											<span key={artist.artist.id || artistIndex}>
												{artistIndex > 0 && ', '}
												<Link
													href={`/artists/${artist.artist.slug}`}
													className='hover:underline'
												>
													{artist.artist.name}
												</Link>
											</span>
										))}
									</div>
								</TableCell>
								<TableCell className='hidden sm:block'>
									<>
										{track?.artists?.map((artist, artistIndex) => (
											<span key={artist.artist.id || artistIndex}>
												{artistIndex > 0 && ', '}
												<Link
													href={`/artists/${artist.artist.slug}`}
													className='text-muted text-base font-semibold hover:text-primary'
												>
													{artist.artist.name}
												</Link>
											</span>
										))}
									</>
								</TableCell>

								<TableCell>
									<LikeForm trackId={track.id} liked={track.isLiked} />
								</TableCell>

								<TableCell className='text-right pr-4'>
									{track?.duration && formatTime(track?.duration)}
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</div>
	);
}
