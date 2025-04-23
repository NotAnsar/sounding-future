'use client';

import Image from 'next/image';
import { Copy, PauseIcon, PlayIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAudio } from '@/context/AudioContext';
import Link from 'next/link';
import { Icons } from '@/components/icons/track-icons';
import { type TrackDetails } from '@/db/tracks';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';
import LikeForm from '@/components/LikeForm';

export default function TrackDetails({ track }: { track: TrackDetails }) {
	const { currentTrack, isPlaying, togglePlayPause, playNewTrack } = useAudio();
	const isCurrentTrack = currentTrack?.id === track.id;

	return (
		<div
			className='w-full flex flex-col sm:flex-row gap-4 p-4 rounded-3xl text-white'
			style={{
				background: '#cc2b5e',
				backgroundImage: 'linear-gradient(to right,  #cc2b5e,#753a88)',
			}}
		>
			<div
				className={cn(
					'rounded-3xl border border-border/15 overflow-hidden relative group cursor-pointer w-full sm:min-w-64 sm:w-64 xl:min-w-72 xl:w-72  h-auto aspect-square'
				)}
				onClick={() => {
					if (isCurrentTrack) {
						togglePlayPause();
					} else {
						playNewTrack([track]);
					}
				}}
			>
				<div
					className={cn(
						'w-1/4 h-auto aspect-square flex justify-center items-center bg-white rounded-full absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 z-[1]',
						isCurrentTrack ? 'visible' : 'invisible',
						'group-hover:visible'
					)}
				>
					<PauseIcon
						className={cn(
							'w-3/5 h-auto aspect-square text-black fill-black ',
							!(isPlaying && isCurrentTrack) ? 'hidden' : 'block'
						)}
					/>

					<PlayIcon
						className={cn(
							'w-3/5 h-auto aspect-square text-black fill-black cursor-pointer ',
							isPlaying && isCurrentTrack ? 'hidden' : 'block'
						)}
					/>
				</div>
				<Image
					alt={track?.title}
					src={track?.cover}
					width={640}
					height={640}
					className='object-cover h-auto aspect-square w-full'
				/>
			</div>
			<div className='flex flex-col gap-3 mt-auto mb-2'>
				<div className='flex gap-3 flex-col xl:flex-row'>
					<h2 className='text-3xl sm:text-5xl xl:text-6xl font-bold'>
						{track?.title}
					</h2>

					<div className='flex gap-3 items-center ml-auto sm:ml-0'>
						<div className='cursor-pointer h-full flex justify-center items-center'>
							<LikeForm
								trackId={track.id}
								liked={track.isLiked}
								className='w-7 h-auto text-grey hover:text-white '
								likedClassname='text-grey fill-grey hover:text-white hover:fill-white'
							/>
						</div>

						<ShareButton
							artistsSlugs={track.artists.map((a) => ({
								slug: a.artist.slug,
								name: a.artist.name,
							}))}
						/>
					</div>
				</div>

				<div className='flex gap-2.5 items-center'>
					{track.artists && track.artists.length > 0 ? (
						<>
							<div className='flex flex-col sm:flex-row sm:items-center w-full'>
								<div className='flex-shrink-0'>
									<div className='flex'>
										{track.artists.map((artist, index) =>
											artist.artist.pic ? (
												<div
													key={artist.artist.id}
													className={cn(
														'relative',
														index === 0 ? 'ml-0' : '-ml-3.5 sm:-ml-4'
													)}
												>
													<Image
														alt={artist.artist.name}
														src={artist.artist.pic}
														className='rounded-full w-9 sm:w-10 h-9 sm:h-10 object-cover'
														width={40}
														height={40}
													/>
												</div>
											) : (
												<div
													key={artist.artist.id}
													className={cn(
														'relative rounded-full w-8 sm:w-10 h-8 sm:h-10 bg-muted border-2 border-white',
														index === 0 ? 'ml-0' : '-ml-3 sm:-ml-4'
													)}
												/>
											)
										)}
									</div>
								</div>
								<div className='flex flex-wrap items-center mt-2 sm:mt-0 sm:ml-2 max-w-full'>
									{track.artists.map((artist, index) => (
										<div
											key={`name-${artist.artist.id}`}
											className='flex items-center'
										>
											<Link
												href={`/artists/${artist.artist.slug}`}
												className='text-lg sm:text-2xl font-semibold hover:underline cursor-pointer truncate max-w-[200px] sm:max-w-[300px]'
												title={artist.artist.name}
											>
												{artist.artist.name}
											</Link>
											{index < track.artists.length - 1 && (
												<span className='mx-1 flex-shrink-0'>•</span>
											)}
										</div>
									))}
								</div>
							</div>
						</>
					) : (
						<div className='rounded-full w-8 h-8 sm:w-10 sm:h-10 bg-muted flex-shrink-0' />
					)}
				</div>
			</div>
		</div>
	);
}

function ShareButton({
	className,
	artistsSlugs,
}: {
	className?: string;
	artistsSlugs?: { slug: string; name: string }[];
}) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger className={cn('relative', className)}>
				<Icons.share className='w-6 h-auto aspect-square fill-grey hover:fill-white cursor-pointer transition-all duration-300' />
			</DropdownMenuTrigger>
			<DropdownMenuContent align='start'>
				<DropdownMenuItem
					onClick={() => {
						navigator.clipboard.writeText(window.location.href);
						toast({
							description: 'Track link copied to clipboard',
						});
					}}
					className='cursor-pointer'
				>
					<Copy className='w-4 h-auto aspect-square text-muted mr-1.5' />
					Copy link to track
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				{artistsSlugs?.map(({ name, slug }) => (
					<DropdownMenuItem
						key={slug}
						onClick={() => {
							navigator.clipboard.writeText(
								`${window.location.origin}/artists/${slug}`
							);
							toast({
								description: 'Artist link copied to clipboard',
							});
						}}
						className='cursor-pointer'
					>
						<Copy className='w-4 h-auto aspect-square text-muted mr-1.5' />
						Copy link to {name}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
