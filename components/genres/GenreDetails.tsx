'use client';

import { Genre } from '@/config/dummy-data';

export default function GenreDetails({ genre }: { genre: Genre }) {
	return (
		<div
			className='w-full flex gap-4 p-4 rounded-3xl text-white h-auto min-h-40 sm:min-h-48 md:min-h-52 xl:min-h-60 relative'
			style={{
				background: genre.from,
				backgroundImage: `linear-gradient(to right, ${genre.from}, ${genre.to})`,
			}}
		>
			<h2 className='text-[36px] mb-0 sm:text-5xl xl:text-6xl font-bold mt-auto sm:mb-2 md:pl-4'>
				{genre.name}
			</h2>
		</div>
	);
}
