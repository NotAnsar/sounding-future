'use client';

import { cn } from '@/lib/utils';
import GenreCard from './GenreCard';
import { Genre } from '@prisma/client';
import { GENRES_GRADIENT } from '@/db/genre';

export default function GenreList({
	genres,
	className,
}: {
	genres: Genre[];
	className?: string;
}) {
	return (
		<div
			className={cn(
				'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4  gap-x-4 gap-y-6 sm:gap-x-6 sm:gap-y-10',
				className
			)}
		>
			{genres.length === 0 && (
				<p className='text-base text-muted'>No genres found</p>
			)}

			{genres?.map((genre, i) => (
				<GenreCard
					genre={genre}
					key={i}
					from={
						GENRES_GRADIENT[genre.displayOrder % GENRES_GRADIENT.length].from
					}
					to={GENRES_GRADIENT[genre.displayOrder % GENRES_GRADIENT.length].to}
				/>
			))}
		</div>
	);
}
