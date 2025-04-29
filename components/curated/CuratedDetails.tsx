'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import { MapPin } from 'lucide-react';
import Link from 'next/link';
import { PartnerDetails } from '@/db/partner';

export default function CuratedDetails({
	curated,
	isAbout = false,
}: {
	curated: PartnerDetails;
	isAbout?: boolean;
}) {
	return (
		<div
			className='w-full flex flex-col sm:flex-row gap-4 p-4 rounded-3xl text-white '
			style={{
				background: '#6441A5',
				backgroundImage: 'linear-gradient(to bottom, #6441A5, #2a0845)',
			}}
		>
			<div
				className={cn(
					'rounded-3xl border border-border/15 overflow-hidden relative group cursor-pointer sm:min-w-64 sm:w-64 xl:min-w-[268px] xl:w-[268px] '
				)}
			>
				<div className='absolute top-3 right-3 p-2 bg-[#131822] z-10 text-center text-[10px] flex flex-col justify-center items-center leading-3 uppercase rounded-xl'>
					in progress
				</div>
				<Image
					alt={curated?.name}
					src={curated?.picture}
					width={640}
					height={640}
					className='object-cover h-auto aspect-square w-full '
				/>
			</div>

			<div className='flex flex-col gap-3 mt-auto mb-2'>
				<h2 className='text-3xl sm:text-5xl xl:text-6xl font-bold'>
					{curated?.name}
				</h2>
				<h5
					className={cn(
						'text-[15px] flex items-center gap-1 text-[#ddd] font-medium'
					)}
				>
					<MapPin className='w-[18px] h-auto aspect-square ' />
					{curated?.country}
				</h5>
				<Link
					className={cn(
						'text-[13px] py-1.5 px-3 rounded-md font-medium text-white w-fit border-[1.5px] border-white ',
						isAbout && 'bg-primary border-primary-foreground'
					)}
					href={
						isAbout
							? `/curated/${curated.slug}`
							: `/curated/${curated.slug}/about`
					}
				>
					About {curated?.name}
				</Link>
			</div>
		</div>
	);
}
