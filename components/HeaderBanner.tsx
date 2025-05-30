import { cn } from '@/lib/utils';
import Image from 'next/image';
import React from 'react';

export default function HeaderBanner({
	title,
	img,
	className,
	titleClassName,
}: {
	title: string;
	img: string;
	className?: string;
	titleClassName?: string;
}) {
	return (
		<div
			className={cn(
				'w-full h-auto min-h-40 sm:min-h-48 max-h-64 md:min-h-52 relative',
				className
			)}
		>
			<Image
				alt={title}
				src={img}
				width={2500}
				height={500}
				className={cn(
					'w-full h-auto object-cover rounded-3xl min-h-40 sm:min-h-48 md:min-h-52 max-h-64'
				)}
			/>

			{/* <div className='absolute inset-0 bg-black bg-opacity-5 rounded-3xl' /> */}
			<div className='absolute bottom-6 px-6 text-white w-full'>
				<h1
					className={cn(
						'font-bold text-3xl sm:text-5xl md:text-[50px] md:leading-[54px] lg:text-[66px] lg:leading-[66px]',
						titleClassName
					)}
				>
					{title}
				</h1>
			</div>
		</div>
	);
}
