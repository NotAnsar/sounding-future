import { cn } from '@/lib/utils';
import Image from 'next/image';
import React from 'react';

export default function HeaderBanner({
	title,
	img,
	className,
}: {
	title: string;
	img: string;
	className?: string;
}) {
	return (
		<div className={cn('w-full h-auto  relative', className)}>
			<Image
				alt={title}
				src={img}
				width={2500}
				height={500}
				className={cn('w-full h-auto object-cover rounded-3xl ')}
			/>

			{/* <div className='absolute inset-0 bg-black bg-opacity-5 rounded-3xl' /> */}
			<div className='absolute bottom-6 px-6 text-white w-full'>
				<h1 className='font-bold text-3xl sm:text-5xl md:text-[50px] md:leading-[54px] lg:text-[66px] lg:leading-[66px]'>
					{title}
				</h1>
			</div>
		</div>
	);
}
