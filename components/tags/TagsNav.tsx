import { cn } from '@/lib/utils';
import Link from 'next/link';
import React from 'react';

export default function TagsNav({
	currentPath,
}: {
	currentPath: 'Genre' | 'Topics' | 'Series' | 'Format';
}) {
	return (
		<div className='w-full flex justify-between gap-2 items-center my-6'>
			<div className='flex w-fit gap-2 sm:gap-4 bg-background text-white justify-start items-center rounded-lg '>
				<Link
					href={'/user/tags'}
					className={cn(
						'inline-flex text-sm ring-0 sm:text-base px-2 py-1.5 sm:px-3 sm:py-1.5 items-center justify-center whitespace-nowrap rounded-md font-medium transition-all focus-visible:outline-none border border-foreground/60 text-foreground',
						currentPath === 'Genre'
							? 'border-foreground/20 bg-button text-white shadow'
							: 'border-foreground/60 text-foreground'
					)}
				>
					Genre
				</Link>

				<Link
					href={'/user/tags/format'}
					className={cn(
						'inline-flex text-sm ring-0 sm:text-base px-2 py-1.5 sm:px-3 sm:py-1.5 items-center justify-center whitespace-nowrap rounded-md font-medium transition-all focus-visible:outline-none border border-foreground/60 text-foreground',
						currentPath === 'Format'
							? 'border-foreground/20 bg-button text-white shadow'
							: 'border-foreground/60 text-foreground'
					)}
				>
					Source Format
				</Link>

				<Link
					href={'/user/lms/course-series'}
					className={cn(
						'inline-flex text-sm ring-0 sm:text-base px-2 py-1.5 sm:px-3 sm:py-1.5 items-center justify-center whitespace-nowrap rounded-md font-medium transition-all focus-visible:outline-none border border-foreground/60 text-foreground',
						currentPath === 'Series'
							? 'border-foreground/20 bg-button text-white shadow'
							: 'border-foreground/60 text-foreground'
					)}
				>
					Series
				</Link>
				<Link
					href={'/user/lms/course-topics'}
					className={cn(
						'inline-flex text-sm ring-0 sm:text-base px-2 py-1.5 sm:px-3 sm:py-1.5 items-center justify-center whitespace-nowrap rounded-md font-medium transition-all focus-visible:outline-none border border-foreground/60 text-foreground',
						currentPath === 'Topics'
							? 'border-foreground/20 bg-button text-white shadow'
							: 'border-foreground/60 text-foreground'
					)}
				>
					Topics
				</Link>
			</div>
		</div>
	);
}
