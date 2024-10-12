'use client';
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from '@/components/ui/carousel';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export default function ArtistsCarousel({
	artists,
	title = 'Explore our artists',
	className,
	classNameItem,
}: {
	artists: { id: string; name: string; picture: string }[];
	title?: string;
	className?: string;
	classNameItem?: string;
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

				<CarouselContent>
					{artists.map((artist, i) => (
						<CarouselItem
							key={i}
							className={cn('basis-32 sm:basis-40 lg:basis-44', classNameItem)}
						>
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
						</CarouselItem>
					))}
				</CarouselContent>
			</Carousel>
		</div>
	);
}
