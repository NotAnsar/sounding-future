import Image from 'next/image';
import Link from 'next/link';
import { cn, formatCourseDuration } from '@/lib/utils';
import { BookOpen, CircleGauge, Clock4, Play } from 'lucide-react';
import React from 'react';
import { CourseWithRelations } from '@/db/course';

export default function CoursesCard({
	course,
}: {
	course: CourseWithRelations;
}) {
	return (
		<Link
			href={`/tracks/${course.slug}`}
			className='bg-player rounded-lg overflow-hidden'
		>
			<div className='block overflow-hidden w-full h-auto  mb-2 relative group cursor-pointer'>
				<Image
					src={course.thumbnail}
					alt={course.title}
					width={220}
					height={220}
					className='w-full h-auto aspect-video object-cover cursor-pointer border-border '
				/>
			</div>

			<div className='cursor-pointer group block px-4 pb-4'>
				{course?.series?.name && (
					<h5 className='text-muted text-xs md:text-sm font-semibold text-nowrap truncate mb-1'>
						{course?.series?.name}
					</h5>
				)}
				<h4
					className={cn(
						'text-primary-foreground text-sm sm:text-[17px] font-semibold line-clamp-1 hover:text-primary-foreground/95 duration-200 transition-all'
					)}
				>
					{course?.title}
				</h4>
				<div className='grid grid-cols-2 gap-x-2 gap-y-1 text-[13px] text-muted font-medium my-1.5'>
					<div className='flex items-center gap-1'>
						<BookOpen className='w-3.5 h-auto aspect-square ' />
						<span>
							{course.chapters.map((c) => c.published).length} Chapters
						</span>
					</div>
					<div className='flex items-center gap-1'>
						<Clock4 className='w-3.5 h-auto aspect-square ' />
						<span>
							{formatCourseDuration(
								course.chapters.reduce(
									(total, chapter) => total + (chapter.videoDuration || 0),
									0
								)
							)}
						</span>
					</div>
					<div className='flex items-center gap-1'>
						<Play className='w-3.5 h-auto aspect-square ' />
						<span>1234</span>
					</div>
					<div className='flex items-center gap-1'>
						<CircleGauge className='w-3.5 h-auto aspect-square ' />
						<span>{course.level}</span>
					</div>
				</div>
				<div className='flex items-center gap-4 my-2'>
					<span
						className={cn(
							'text-sm px-2.5 rounded-full bg-primary/40 dark:bg-primary/70 text-primary-foreground py-0.5',
							course.accessType.toLowerCase() !== 'free' &&
								'bg-muted-foreground dark:bg-muted-foreground text-white'
						)}
					>
						Free
					</span>
					<span
						className={cn(
							'text-sm px-2.5 rounded-full bg-primary/40 dark:bg-primary/70 text-primary-foreground py-0.5',
							course.accessType.toLowerCase() !== 'pro' &&
								'bg-muted-foreground dark:bg-muted-foreground text-white'
						)}
					>
						Pro
					</span>
				</div>

				<p className='line-clamp-5'>{course?.description}</p>
			</div>
		</Link>
	);
}

export function CoursesListCard({ course }: { course: CourseWithRelations }) {
	return (
		<Link
			href={`/tracks/${course.slug}`}
			className='bg-player rounded-lg overflow-hidden flex gap-4 hover:bg-player/80 transition-colors'
		>
			<div className='flex-shrink-0 w-auto h-full relative group cursor-pointer'>
				<Image
					src={course.thumbnail}
					alt={course.title}
					width={220}
					height={220}
					className='w-auto h-full object-cover rounded-l cursor-pointer border-border aspect-video'
				/>
			</div>

			<div className='flex-1 cursor-pointer group p-4 '>
				{course?.series?.name && (
					<h5 className='text-muted text-xs md:text-sm font-semibold mb-1'>
						{course?.series?.name}
					</h5>
				)}
				<h4
					className={cn(
						'text-primary-foreground text-sm sm:text-[17px] font-semibold line-clamp-1 hover:text-primary-foreground/95 duration-200 transition-all mb-2'
					)}
				>
					{course?.title}
				</h4>

				<div className='flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-muted font-medium mb-2'>
					<div className='flex items-center gap-1'>
						<BookOpen className='w-3.5 h-auto aspect-square' />
						<span>
							{course.chapters.map((c) => c.published).length} Chapters
						</span>
					</div>
					<div className='flex items-center gap-1'>
						<Clock4 className='w-3.5 h-auto aspect-square' />
						<span>
							{formatCourseDuration(
								course.chapters.reduce(
									(total, chapter) => total + (chapter.videoDuration || 0),
									0
								)
							)}
						</span>
					</div>
					<div className='flex items-center gap-1'>
						<Play className='w-3.5 h-auto aspect-square' />
						<span>1234</span>
					</div>
					<div className='flex items-center gap-1'>
						<CircleGauge className='w-3.5 h-auto aspect-square' />
						<span>{course.level}</span>
					</div>
				</div>

				<div className='flex items-center gap-2 mb-2'>
					<span
						className={cn(
							'text-xs px-2 rounded-full bg-primary/40 dark:bg-primary/70 text-primary-foreground py-0.5',
							course.accessType.toLowerCase() !== 'free' &&
								'bg-muted-foreground dark:bg-muted-foreground text-white'
						)}
					>
						Free
					</span>
					<span
						className={cn(
							'text-xs px-2 rounded-full bg-primary/40 dark:bg-primary/70 text-primary-foreground py-0.5',
							course.accessType.toLowerCase() !== 'pro' &&
								'bg-muted-foreground dark:bg-muted-foreground text-white'
						)}
					>
						Pro
					</span>
				</div>

				<p className='line-clamp-2 text-sm text-muted-foreground'>
					{course?.description}
				</p>
			</div>
		</Link>
	);
}
