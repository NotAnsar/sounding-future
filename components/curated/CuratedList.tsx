import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Partner } from '@prisma/client';

export default function CuratedList({
	partners,
	className,
}: {
	partners: Partner[];
	className?: string;
}) {
	return (
		<div
			className={cn(
				'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-6 sm:gap-x-6 sm:gap-y-10',
				className
			)}
		>
			{partners.map((c, i) => (
				<Link key={i} href={`/curated/${c?.id}`}>
					<div className='rounded-2xl block border overflow-hidden w-full h-auto mb-2'>
						<Image
							src={c?.picture}
							alt={c?.name}
							width={220}
							height={220}
							className='w-full h-auto aspect-square object-cover transition-all hover:scale-105 cursor-pointer border-border '
						/>
					</div>

					<h3 className=' lg:text-lg font-semibold line-clamp-2'>{c?.name}</h3>
					<h4 className='text-xs md:text-sm font-light text-muted '>
						{c?.country}
					</h4>
				</Link>
			))}
		</div>
	);
}
