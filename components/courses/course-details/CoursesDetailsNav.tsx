import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';

export default function CoursesDetailsNav({
	tabs,
}: {
	tabs: { label: string; link: string }[];
}) {
	return (
		<div className='flex gap-1.5 justify-between flex-col sm:flex-row'>
			<TabsList className='flex w-full sm:w-fit gap-2 sm:gap-2.5 bg-background text-white justify-start flex-wrap'>
				{tabs.map((tab) => (
					<TabsTrigger
						key={tab.label}
						value={tab.link}
						className='!p-0 rounded-full flex-shrink-0'
					>
						<Link
							href={`?tab=${tab.link}`}
							className='px-2 py-1.5 sm:px-4 sm:py-1.5 rounded-full whitespace-nowrap text-sm sm:text-[15px]'
						>
							{tab.label}
						</Link>
					</TabsTrigger>
				))}
			</TabsList>
		</div>
	);
}
