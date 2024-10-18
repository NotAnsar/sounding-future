'use client';

import { cn } from '@/lib/utils';
import GenreCard from './GenreCard';
import { Genre } from '@/config/dummy-data';

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
			{genres.map((genre, i) => (
				<GenreCard genre={genre} key={i} />
			))}
		</div>
	);
}
