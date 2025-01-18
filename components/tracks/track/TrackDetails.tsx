'use client';

import Image from 'next/image';
import { Copy, PauseIcon, PlayIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAudio } from '@/context/AudioContext';
import Link from 'next/link';
import { Icons } from '@/components/icons/track-icons';
import { PublicTrackWithLikeStatus } from '@/db/tracks';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';
import LikeForm from '@/components/LikeForm';

export default function TrackDetails({
	track,
}: {
	track: PublicTrackWithLikeStatus;
}) {
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
								className='w-7 h-auto text-white'
							/>
						</div>

						<ShareButton artistId={track.artist.slug} />
					</div>
				</div>

				<div className='flex gap-2.5 items-center'>
					{track?.artist?.pic ? (
						<Image
							alt={track?.artist?.name}
							src={track?.artist?.pic}
							className='rounded-full w-8 sm:w-12 h-auto aspect-square object-cover'
							width={48}
							height={48}
						/>
					) : (
						<div className='rounded-full w-8 sm:w-12 h-auto bg-muted' />
					)}

					<Link
						href={`/artists/${track.artist.slug}`}
						className='text-lg sm:text-2xl font-semibold hover:underline cursor-pointer line-clamp-1 '
					>
						{track.artist.name}
					</Link>
					{/* <div
						onClick={() => setFollowed((l) => !l)}
						className='cursor-pointer h-full flex justify-center items-center'
					>
						{followed ? (
							<Icons.follow className='min-w-6 w-6 sm:min-w-7 sm:w-7 h-auto aspect-square fill-white flex-nowrap text-nowrap cursor-pointer' />
						) : (
							<Icons.unfollow className='min-w-6 w-6 sm:min-w-7 sm:w-7 h-auto aspect-square fill-white flex-nowrap text-nowrap cursor-pointer' />
						)}
					</div> */}
				</div>
			</div>
		</div>
	);
}

function ShareButton({
	className,
	artistId,
}: {
	className?: string;
	artistId?: string;
}) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger className={cn('relative', className)}>
				<Icons.share className='w-6 h-auto aspect-square fill-white cursor-pointer' />
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
				<DropdownMenuItem
					onClick={() => {
						navigator.clipboard.writeText(
							`${window.location.origin}/artists/${artistId}`
						);
						toast({
							description: 'Artist link copied to clipboard',
						});
					}}
					className='cursor-pointer'
				>
					<Copy className='w-4 h-auto aspect-square text-muted mr-1.5' />
					Copy link to artist
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
