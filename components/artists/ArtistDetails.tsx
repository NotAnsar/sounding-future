'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Artist } from '@/config/dummy-data';
import { Icons } from '@/components/icons/track-icons';
import { useState } from 'react';

export default function ArtistDetails({ artist }: { artist: Artist }) {
	const [followed, setFollowed] = useState(false);

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
					'rounded-full border border-border/15 overflow-hidden relative group cursor-pointer w-full sm:min-w-64 sm:w-64 xl:min-w-[268px] xl:w-[268px] h-auto aspect-square'
				)}
			>
				<Image
					alt={artist.name}
					src={artist.picture}
					width={640}
					height={640}
				/>
			</div>

			<div className='flex flex-col gap-3 mt-auto mb-2'>
				<div className='flex gap-3 items-center'>
					<h2 className='text-3xl sm:text-5xl xl:text-6xl font-bold'>
						{artist.name}
					</h2>
					<div
						onClick={() => setFollowed((l) => !l)}
						className='cursor-pointer h-full flex justify-center items-center'
					>
						{followed ? (
							<Icons.follow className='min-w-7 w-7 sm:min-w-9 sm:w-9 h-auto aspect-square fill-white flex-nowrap text-nowrap cursor-pointer' />
						) : (
							<Icons.unfollow className='min-w-7 w-7 sm:min-w-9 sm:w-9 h-auto aspect-square fill-white flex-nowrap text-nowrap cursor-pointer' />
						)}
					</div>
				</div>

				<h5
					className={cn(
						'text-sm sm:text-[15px] flex items-center gap-1 text-[#ddd] sm:font-medium'
					)}
				>
					<Icons.tag className='w-5 h-auto aspect-auto fill-foreground' />{' '}
					{artist.genres.map((g) => g.name).join(', ')}
				</h5>
			</div>
		</div>
	);
}
