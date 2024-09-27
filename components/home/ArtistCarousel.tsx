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
	// artists,
	// title,
	className,
}: {
	// artists: { id: string; name: string; picture: string }[];
	// title?: string;
	className?: string;
}) {
	return (
		<div className={cn('', className)}>
			<Carousel opts={{ align: 'start' }}>
				<div className='flex justify-between items-center mb-4'>
					<h1 className='text-[22px] font-semibold text-primary'>
						Explore our artists
					</h1>

					{true ? (
						<div className='flex border-2 border-foreground rounded-sm items-center'>
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
						<CarouselItem key={i} className='basis-32 sm:basis-40 lg:basis-44'>
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

const artists = [
	{
		id: '1',
		picture: '/artists/Anna-Novak.png',
		name: 'Anna Novak',
	},
	{
		id: '2',
		picture: '/artists/Carlos-Ruiz.png',
		name: 'Carlos Ruiz',
	},
	{
		id: '3',
		picture: '/artists/Chen-Wei.png',
		name: 'Chen Wei',
	},
	{
		id: '4',
		picture: '/artists/David-Müller.png',
		name: 'David Müller',
	},
	{
		id: '5',
		picture: '/artists/Diego-Fernandez.png',
		name: 'Diego Fernandez',
	},
	{
		id: '6',
		picture: '/artists/Elena-Rossi.png',
		name: 'Elena Rossi',
	},
	{
		id: '7',
		picture: '/artists/Juan-Martinez.png',
		name: 'Juan Martinez',
	},
	{
		id: '8',
		picture: '/artists/Liam-O-Connor.png',
		name: "Liam O'Connor",
	},
	{
		id: '9',
		picture: '/artists/Luka-Petrovic.png',
		name: 'Luka Petrovic',
	},
	{
		id: '10',
		picture: '/artists/Maria-Silva.png',
		name: 'Maria Silva',
	},
	{
		id: '11',
		picture: '/artists/Max-Harris.png',
		name: 'Max Harris',
	},
	{
		id: '12',
		picture: '/artists/Sidney-Clifford.png',
		name: 'Sidney Clifford',
	},
	{
		id: '13',
		picture: '/artists/Yasmin-Al-Sayed.png',
		name: 'Yasmin Al-Sayed',
	},
];
