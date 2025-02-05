import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { buttonVariants } from '../ui/button';
import { cn } from '@/lib/utils';
import { Icons } from '../icons/audio-player';

export default function DynamicNav({
	type,
	sort,
	label = 'Tracks',
}: {
	type: string;
	sort: string;
	label?: string;
}) {
	const isTable = type === 'table';
	return (
		<div className='flex justify-between gap-1.5'>
			<TabsList className='flex w-fit gap-2 sm:gap-4 bg-background text-white justify-start'>
				<TabsTrigger value='new' className='!p-0'>
					<Link href={`?sort=new`} className='px-2 py-1.5 sm:px-3 sm:py-1.5'>
						New {label}
					</Link>
				</TabsTrigger>
				<TabsTrigger value='popular' className='!p-0'>
					<Link
						href={`?sort=popular`}
						className='px-2 py-1.5 sm:px-3 sm:py-1.5'
					>
						Popular {label}
					</Link>
				</TabsTrigger>
			</TabsList>
			<div className='flex gap-1 ml-auto sm:ml-0  '>
				<Link
					href={`?type=table${sort ? '&sort=' + sort : ''}`}
					className={cn(
						buttonVariants(),
						'bg-transparent p-1.5 sm:p-2 hover:bg-button group h-fit duration-200 transition-all shadow-none',
						isTable ? 'bg-button' : ''
					)}
				>
					<Icons.table
						className={cn(
							'w-5 sm:w-6 h-auto aspect-square text-foreground group-hover:text-white',
							isTable ? 'text-white' : ''
						)}
					/>
				</Link>
				<Link
					href={`?type=grid${sort ? '&sort=' + sort : ''}`}
					className={cn(
						buttonVariants(),
						'bg-transparent p-1.5 sm:p-2 hover:bg-button h-fit group shadow-none duration-200 transition-all',
						!isTable ? 'bg-button' : ''
					)}
				>
					<Icons.grid
						className={cn(
							'w-5 sm:w-6 h-auto aspect-square text-foreground group-hover:text-white shadow-none',
							!isTable ? 'text-white' : ''
						)}
					/>
				</Link>
			</div>
		</div>
	);
}
