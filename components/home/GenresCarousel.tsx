'use client';

import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from '@/components/ui/carousel';
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

				<CarouselContent className='gap-4 h-max'>
					{genres.map((genre, i) => (
						<CarouselItem key={i} className='basis-52 lg:basis-56 '>
							<Link
								href={`/genres/${genre?.id}`}
								className='px-6 py-4 bg-gradient-to-b from-primary to-primary-foreground rounded-3xl flex flex-col h-32 text-white cursor-pointer'
								style={{
									background: `linear-gradient(180deg, ${
										GENRES_GRADIENT[i % GENRES_GRADIENT.length].from
									} 0%, ${
										GENRES_GRADIENT[i % GENRES_GRADIENT.length].to
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
const GENRES_GRADIENT = [
	{ from: '#A42F67', to: '#513383' },
	{ from: '#267B43', to: '#2F489F' },
	{ from: '#7F8128', to: '#1F1D7B' },
	{ from: '#f46217', to: '#0b486b' },
	{ from: '#4b1248', to: '#efc27b' },
];
