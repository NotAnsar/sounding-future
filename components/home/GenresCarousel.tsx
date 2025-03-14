'use client';

import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from '@/components/ui/carousel';
import { GENRES_GRADIENT } from '@/db/genre';
import { cn } from '@/lib/utils';
import { Genre } from '@prisma/client';
import Link from 'next/link';

export default function GenresCarousel({
	genres,
	title,
	className,
}: {
	genres: Genre[];
	title?: string;
	className?: string;
}) {
	return (
		<div className={cn('', className)}>
			<Carousel opts={{ align: 'start' }}>
				<div className='flex justify-between items-center mb-4'>
					<h1 className='text-[22px] font-semibold text-primary-foreground'>
						{title}
					</h1>

					{true ? (
						<div className='flex border-2 border-secondary rounded-sm items-center'>
							<CarouselPrevious className='static border-none rounded-none translate-y-0' />
							<CarouselNext className='static border-none rounded-none translate-y-0' />
						</div>
					) : (
						<>
							<CarouselPrevious
								className='left-0 -translate-x-1/2 z-40'
								variant={'default'}
								size={'icon'}
							/>
							<CarouselNext className='right-0 z-40' />
						</>
					)}
				</div>

				{!genres.length && <p className='text-muted'>No genres found</p>}

				<CarouselContent className='gap-4 h-max'>
					{genres.map((genre, i) => (
						<CarouselItem key={i} className='basis-52 lg:basis-56 '>
							<Link
								href={`/genres/${genre?.slug}`}
								className='px-6 py-4 bg-gradient-to-b from-primary to-primary-foreground rounded-3xl flex flex-col h-32 text-white duration-300 hover:brightness-110 hover:shadow-md'
								style={{
									background: `linear-gradient(180deg, ${
										GENRES_GRADIENT[genre.displayOrder % GENRES_GRADIENT.length]
											.from
									} 0%, ${
										GENRES_GRADIENT[genre.displayOrder % GENRES_GRADIENT.length]
											.to
									} 100%)`,
								}}
							>
								<h5 className='text-[11px] font-bold ml-auto'>3D Audio</h5>
								<h3
									className={cn(
										'text-lg sm:text-xl font-semibold line-clamp-2 mt-auto'
									)}
								>
									{genre?.name}
								</h3>
							</Link>
						</CarouselItem>
					))}
				</CarouselContent>
			</Carousel>
		</div>
	);
}
