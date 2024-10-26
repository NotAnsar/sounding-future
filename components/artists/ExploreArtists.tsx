'use client';

import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export default function ExploreArtists({
	artists,

	className,
}: {
	artists: { id: string; name: string; picture: string }[];

	className?: string;
}) {
	return (
		<div
			className={cn(
				'grid grid-cols-3 gap-x-4 gap-y-6 sm:grid-cols-4  sm:gap-x-6 sm:gap-y-10',
				className
			)}
		>
			{artists.map((artist, i) => (
				<div key={i} className=''>
					<Link
						href={`/artists/${artist.id}`}
						className='rounded-full block border overflow-hidden w-full h-auto mb-2'
					>
						<Image
							src={artist.picture}
							alt={artist.name}
							width={220}
							height={220}
							className='w-full h-auto aspect-square object-cover transition-all hover:scale-105 cursor-pointer border-border '
						/>
					</Link>

					<Link
						href={`/artists/${artist.id}`}
						className='text-sm md:text-base font-semibold text-center line-clamp-2'
					>
						{artist.name}
					</Link>
				</div>
			))}
		</div>
	);
}
