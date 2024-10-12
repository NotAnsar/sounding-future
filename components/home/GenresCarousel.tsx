'use client';

import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';

export default function GenresCarousel({
	// collections,
	title,
	className,
}: {
	// collections: { name: string; id: string }[];
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
							<div
								className='px-6 py-4 bg-gradient-to-b from-primary to-primary-foreground rounded-3xl flex flex-col h-32 text-white'
								style={{ background: gradients[i % gradients.length] }}
							>
								<h5 className='text-[11px] font-bold ml-auto'>3D Audio</h5>
								<h3
									className={cn(
										'text-lg sm:text-xl font-semibold line-clamp-2 mt-auto'
									)}
								>
									{genre.name}
								</h3>
							</div>
						</CarouselItem>
					))}
				</CarouselContent>
			</Carousel>
		</div>
	);
}

const gradients = [
	'linear-gradient(180deg, #A42F67 0%, #513383 100%)',
	'linear-gradient(180deg, #267B43 0%, #2F489F 100%)',
	'linear-gradient(180deg, #7F8128 0%, #1F1D7B 100%)',
];

const genres = [
	{
		id: '1',
		name: 'Electronic Music',
		from: '',
	},
	{ id: '2', name: 'Field Recordings' },
	{ id: '3', name: 'Contemporary Music' },
];
