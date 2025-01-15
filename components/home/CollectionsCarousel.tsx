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
import { Partner } from '@prisma/client';

export default function PartnersCarousel({
	partners,
	title,
	className,
}: {
	partners: Partner[];
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

				{!partners.length && <p className='text-muted'>No partners found</p>}

				<CarouselContent>
					{partners?.map((partner, i) => (
						<CarouselItem key={i} className='basis-40 md:basis-52 lg:basis-56'>
							<Link
								href={`/curated/${partner?.id}`}
								className='rounded-2xl block border overflow-hidden w-full h-auto mb-2'
							>
								<Image
									src={partner?.picture}
									alt={partner?.name}
									width={220}
									height={220}
									className='w-full h-auto aspect-square object-cover transition-all hover:scale-105 cursor-pointer border-border '
								/>
							</Link>

							<h3
								className={cn(
									'text-sm sm:text-[17px] font-semibold line-clamp-1'
								)}
							>
								{partner?.name}
							</h3>
						</CarouselItem>
					))}
				</CarouselContent>
			</Carousel>
		</div>
	);
}
