import { cn } from '@/lib/utils';
import { Genre } from '@prisma/client';
import Link from 'next/link';
import React from 'react';

export default function GenreCard({
	genre,
	from,
	to,
}: {
	genre: Genre;
	from: string;
	to: string;
}) {
	return (
		<Link
			href={`/genres/${genre.slug}`}
			className='px-6 py-4 bg-gradient-to-b from-primary to-primary-foreground rounded-3xl flex flex-col h-40  md:h-52 text-white'
			style={{
				background: `linear-gradient(180deg, ${from} 0%, ${to} 100%)`,
			}}
		>
			<h5 className='text-[11px] font-bold ml-auto'>3D Audio</h5>
			<h3
				className={cn(
					'text-lg sm:text-xl lg:text-2xl font-semibold line-clamp-2 mt-auto '
				)}
			>
				<span className='block'>{genre.name.split(' ')[0]}</span>
				{genre.name.split(' ').slice(1).join(' ')}
			</h3>
		</Link>
	);
}
