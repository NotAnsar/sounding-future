import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { buttonVariants } from '../ui/button';
import { cn } from '@/lib/utils';
import { Icons } from '../icons/audio-player';

export default function TracksNav({ type }: { type: string }) {
	const isTable = type === 'table';
	return (
		<div className='flex flex-col sm:flex-row justify-between gap-1.5'>
			<TabsList className='flex w-fit gap-2 sm:gap-4 bg-background text-white justify-start'>
				<TabsTrigger value='new' className='!p-0'>
					<Link href={'/tracks'} className='px-2 py-1.5 sm:px-3 sm:py-1.5'>
						New <span className='hidden sm:inline'>Tracks</span>
					</Link>
				</TabsTrigger>
				<TabsTrigger value='popular' className='!p-0'>
					<Link
						href={'/tracks/popular'}
						className='px-2 py-1.5 sm:px-3 sm:py-1.5'
					>
						Popular <span className='hidden sm:inline'>Tracks</span>
					</Link>
				</TabsTrigger>
				<TabsTrigger value='curated' className='!p-0'>
					<Link
						href={'/tracks/curated'}
						className='px-2 py-1.5 sm:px-3 sm:py-1.5'
					>
						Curated Selections
					</Link>
				</TabsTrigger>
			</TabsList>
			<div className='flex gap-1 ml-auto sm:ml-0  '>
				<Link
					href={'?type=table'}
					className={cn(
						buttonVariants(),
						'bg-transparent p-1.5 sm:p-2 hover:bg-button h-fit ',
						isTable ? 'bg-button' : ''
					)}
				>
					<Icons.table className='w-5 sm:w-6 h-auto aspect-square' />
				</Link>
				<Link
					href={'?type=grid'}
					className={cn(
						buttonVariants(),
						'bg-transparent p-1.5 sm:p-2 hover:bg-button h-fit ',
						!isTable ? 'bg-button' : ''
					)}
				>
					<Icons.grid className='w-5 sm:w-6 h-auto aspect-square' />
				</Link>
			</div>
		</div>
	);
}
