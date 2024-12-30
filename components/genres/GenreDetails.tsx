'use client';

import { type GenreDetails, GENRES_GRADIENT } from '@/db/genre';

export default function GenreDetails({ genre }: { genre: GenreDetails }) {
	const currentGradient =
		GENRES_GRADIENT[genre.displayOrder % GENRES_GRADIENT.length];

	return (
		<div
			className='w-full flex gap-4 p-4 rounded-3xl text-white h-auto min-h-40 sm:min-h-48 md:min-h-52 xl:min-h-60 relative'
			style={{
				background: currentGradient.from,
				backgroundImage: `linear-gradient(to right, ${currentGradient.from}, ${currentGradient.to})`,
			}}
		>
			<h2 className='text-[36px] leading-tight mb-0 sm:text-5xl sm:leading-none xl:text-6xl font-bold mt-auto sm:mb-2 md:pl-4'>
				{genre.name}
			</h2>
		</div>
	);
}
