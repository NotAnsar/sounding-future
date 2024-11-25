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
import { TracksWithArtist } from '@/db/tracks';

export default function TracksCarousel({
	tracks,
	title,
	className,
	classNameItem,
	classNameTitle,
}: {
	tracks: TracksWithArtist;
	title?: string;
	className?: string;
	classNameItem?: string;
	classNameTitle?: string;
}) {
	return (
		<div className={cn('', className)}>
			<Carousel opts={{ align: 'start' }}>
				<div className='flex justify-between items-center mb-4'>
					<h1
						className={cn(
							'text-[22px] font-semibold text-primary-foreground',
							classNameTitle
						)}
					>
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
					{tracks?.map((track, i) => (
						<CarouselItem
							key={i}
							className={cn('basis-40 md:basis-52 lg:basis-56', classNameItem)}
						>
							<Link
								href={`/tracks/${track?.id}`}
								className='rounded-2xl block border overflow-hidden w-full h-auto mb-2'
							>
								<Image
									src={track?.cover}
									alt={track?.title}
									width={220}
									height={220}
									className='w-full h-auto aspect-square object-cover transition-all hover:scale-105 cursor-pointer border-border '
								/>
							</Link>

							<Link
								href={`/artists/${track?.artist?.id}`}
								className='text-muted text-sm md:text-base font-semibold text-nowrap'
							>
								{track?.artist?.name}
							</Link>
							<Link
								href={`/tracks/${track.id}`}
								className={cn(
									'text-sm sm:text-[17px] font-semibold line-clamp-1'
									// isCurrentTrack ? 'text-primary' : ''
								)}
							>
								{track?.title}
							</Link>
							<h6 className='text-xs hidden md:block md:text-sm font-light text-muted line-clamp-1'>
								{track?.genres?.map((g) => g.genre.name).join(', ')}
							</h6>
						</CarouselItem>
					))}
				</CarouselContent>
			</Carousel>
		</div>
	);
}
