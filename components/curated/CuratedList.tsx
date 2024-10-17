import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Collection } from '@/config/dummy-data';

export default function CuratedList({
	collections,
	className,
}: {
	collections: Collection[];
	className?: string;
}) {
	return (
		<div
			className={cn(
				'grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-6 sm:gap-x-6 sm:gap-y-10',
				className
			)}
		>
			{collections.map((c, i) => (
				<div key={i} className=''>
					<Link
						href={`/curated/${c.id}`}
						className='rounded-2xl block border overflow-hidden w-full h-auto mb-2'
					>
						<Image
							src={c.picture}
							alt={c.name}
							width={220}
							height={220}
							className='w-full h-auto aspect-square object-cover transition-all hover:scale-105 cursor-pointer border-border '
						/>
					</Link>

					<h3 className=' lg:text-lg font-semibold line-clamp-2'>{c.name}</h3>
					<h4 className='text-xs md:text-sm font-light text-muted '>
						{c.country}
					</h4>
				</div>
			))}
		</div>
	);
}
