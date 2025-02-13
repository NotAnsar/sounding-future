// 'use client';
// import { useState } from 'react';
// const [followed, setFollowed] = useState(false);

import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/icons/track-icons';
import { type ArtistDetails } from '@/db/artist';
import FollowForm from '../FollowForm';

export default function ArtistDetails({ artist }: { artist: ArtistDetails }) {
	return (
		<div
			className='w-full flex flex-col sm:flex-row gap-4 p-4 rounded-3xl text-white'
			style={{
				background: '#000428',
				backgroundImage: 'linear-gradient(to bottom, #000428, #004e92)',
			}}
		>
			<div
				className={cn(
					'rounded-full border border-border/15 overflow-hidden relative group cursor-pointer sm:min-w-64 sm:w-64 xl:min-w-[268px] xl:w-[268px] '
				)}
			>
				{artist.pic ? (
					<Image
						alt={artist.name}
						src={artist.pic}
						width={640}
						height={640}
						className='w-full h-auto aspect-square object-cover'
					/>
				) : (
					<div className='w-full h-full bg-muted' />
				)}
			</div>

			<div className='flex flex-col gap-3 mt-auto mb-2'>
				<div className='flex gap-3 items-center'>
					<h2 className='text-3xl sm:text-5xl xl:text-6xl font-bold'>
						{artist.name}
					</h2>

					<FollowForm artistId={artist.id} followed={artist.followed} />
				</div>

				{artist.genres.length > 0 && (
					<h5
						className={cn(
							'text-sm sm:text-[15px] flex items-center gap-1 text-[#ddd] sm:font-medium'
						)}
					>
						<Icons.tag className='w-5 h-auto aspect-auto fill-white' />{' '}
						{artist.genres.map((g) => g.genre.name).join(', ')}
					</h5>
				)}
			</div>
		</div>
	);
}
