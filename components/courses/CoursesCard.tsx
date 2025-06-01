import Image from 'next/image';
import Link from 'next/link';
import { cn, formatCourseDuration } from '@/lib/utils';
import { BookOpen, CircleGauge, Clock4, Play } from 'lucide-react';
import React from 'react';
import { CourseWithRelations } from '@/db/course';

interface CourseCardProps {
	course: CourseWithRelations & {
		progressPercentage?: number;
		isCompleted?: boolean;
		lastAccessedAt?: Date | null;
		currentChapterSlug?: string; // ADD THIS LINE
	};
	showProgress?: boolean;
}

export default function CoursesCard({
	course,
	showProgress = false,
}: CourseCardProps) {
	const hasProgress =
		showProgress && typeof course.progressPercentage === 'number';

	return (
		<Link
			href={`/courses/${course.slug}${
				course.currentChapterSlug ? `?chapter=${course.currentChapterSlug}` : ''
			}`}
			className='bg-player rounded-lg overflow-hidden hover:bg-player/80 transition-colors duration-200'
		>
			<div className='block overflow-hidden w-full h-auto mb-2 relative group cursor-pointer'>
				<Image
					src={course.thumbnail}
					alt={course.title}
					width={220}
					height={220}
					className='w-full h-auto aspect-video object-cover cursor-pointer border-border hover:scale-105 transition-transform duration-300'
				/>
				{/* Progress overlay for completed courses */}
				{hasProgress && course.isCompleted && (
					<div className='absolute top-2 right-2'>
						<div className='bg-green-500 rounded-full p-1'>
							<svg
								className='w-4 h-4 text-white'
								fill='currentColor'
								viewBox='0 0 20 20'
							>
								<path
									fillRule='evenodd'
									d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
									clipRule='evenodd'
								/>
							</svg>
						</div>
					</div>
				)}
			</div>

			<div className='cursor-pointer group block px-4 pb-4'>
				{/* Series Name & Status */}
				<div className='flex items-center justify-between mb-1'>
					{course?.series?.name && (
						<h5 className='text-muted text-xs md:text-sm font-semibold text-nowrap truncate'>
							{course?.series?.name}
						</h5>
					)}
					{hasProgress && (
						<CourseStatus
							isCompleted={course.isCompleted || false}
							progressPercentage={course.progressPercentage || 0}
						/>
					)}
				</div>

				<h4
					className={cn(
						'text-primary-foreground text-sm sm:text-[17px] font-semibold line-clamp-1 hover:text-primary-foreground/95 duration-200 transition-all'
					)}
				>
					{course?.title}
				</h4>

				{/* Progress Bar */}
				{hasProgress && (
					<div className='my-3'>
						<ProgressBar percentage={course.progressPercentage || 0} />
					</div>
				)}

				{/* Course Stats */}
				<div className='grid grid-cols-2 gap-x-2 gap-y-1 text-[13px] text-muted font-medium my-1.5'>
					<div className='flex items-center gap-1'>
						<BookOpen className='w-3.5 h-auto aspect-square' />
						<span>
							{course.chapters.filter((c) => c.published).length} Chapters
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
					{course._count.courseProgress > 0 && (
						<div className='flex items-center gap-1'>
							<Play className='w-3.5 h-auto aspect-square' />
							<span>{course._count.courseProgress}</span>
						</div>
					)}
					<div className='flex items-center gap-1'>
						<CircleGauge className='w-3.5 h-auto aspect-square' />
						<span>{course.level}</span>
					</div>
				</div>

				{/* Access Type Badges */}
				<div className='flex items-center gap-4 my-2'>
					<span
						className={cn(
							'text-sm px-2.5 rounded-full bg-primary/40 dark:bg-primary/55 text-primary-foreground py-0.5',
							course.accessType.toLowerCase() !== 'free' &&
								'bg-muted-foreground dark:bg-muted-foreground text-white'
						)}
					>
						Free
					</span>
					<span
						className={cn(
							'text-sm px-2.5 rounded-full bg-primary/40 dark:bg-primary/55 text-primary-foreground py-0.5',
							course.accessType.toLowerCase() !== 'pro' &&
								'bg-muted-foreground dark:bg-muted-foreground text-white'
						)}
					>
						Pro
					</span>
				</div>

				{/* Last Accessed Info */}
				{hasProgress && course.lastAccessedAt && (
					<div className='text-xs text-muted-foreground mb-2'>
						Last accessed:{' '}
						{new Date(course.lastAccessedAt).toLocaleDateString()}
					</div>
				)}

				<p className='line-clamp-5'>{course?.description}</p>
			</div>
		</Link>
	);
}

export function CoursesListCard({
	course,
	showProgress = false,
}: CourseCardProps) {
	const hasProgress =
		showProgress && typeof course.progressPercentage === 'number';

	return (
		<Link
			href={`/courses/${course.slug}`}
			className='bg-player rounded-lg overflow-hidden flex flex-col sm:flex-row gap-0 sm:gap-4 hover:bg-player/80 transition-colors'
		>
			{/* Image Container with Fixed Aspect Ratio */}
			<div className='flex-shrink-0 w-full sm:w-48 md:w-56 lg:w-64 relative group cursor-pointer overflow-hidden'>
				<div className='aspect-video w-full h-full relative'>
					<Image
						src={course.thumbnail}
						alt={course.title}
						fill
						sizes='(max-width: 640px) 100vw, (max-width: 768px) 192px, (max-width: 1024px) 224px, 256px'
						className='object-cover hover:scale-105 transition-transform duration-300'
						priority={false}
					/>
					{/* Progress overlay for completed courses */}
					{hasProgress && course.isCompleted && (
						<div className='absolute top-2 right-2'>
							<div className='bg-green-500 rounded-full p-1'>
								<svg
									className='w-4 h-4 text-white'
									fill='currentColor'
									viewBox='0 0 20 20'
								>
									<path
										fillRule='evenodd'
										d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
										clipRule='evenodd'
									/>
								</svg>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Content Container */}
			<div className='flex-1 cursor-pointer group p-4'>
				{/* Series Name & Status */}
				<div className='flex items-center justify-between mb-1'>
					{course?.series?.name && (
						<h5 className='text-muted text-xs md:text-sm font-semibold line-clamp-1'>
							{course?.series?.name}
						</h5>
					)}
					{hasProgress && (
						<CourseStatus
							isCompleted={course.isCompleted || false}
							progressPercentage={course.progressPercentage || 0}
						/>
					)}
				</div>

				<h4
					className={cn(
						'text-primary-foreground text-sm sm:text-base lg:text-lg font-semibold line-clamp-2 hover:text-primary-foreground/95 duration-200 transition-all mb-2'
					)}
				>
					{course?.title}
				</h4>

				{/* Progress Bar */}
				{hasProgress && (
					<div className='mb-3'>
						<ProgressBar percentage={course.progressPercentage || 0} />
					</div>
				)}

				{/* Course Stats - Responsive Grid */}
				<div className='flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-muted font-medium mb-2'>
					<div className='flex items-center gap-1'>
						<BookOpen className='w-3.5 h-auto aspect-square' />
						<span>
							{course.chapters.filter((c) => c.published).length} Chapters
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
					{course._count.courseProgress > 0 && (
						<div className='flex items-center gap-1'>
							<Play className='w-3.5 h-auto aspect-square' />
							<span>{course._count.courseProgress}</span>
						</div>
					)}
					<div className='flex items-center gap-1'>
						<CircleGauge className='w-3.5 h-auto aspect-square' />
						<span>{course.level}</span>
					</div>
				</div>

				{/* Access Type Badges */}
				<div className='flex items-center gap-2 mb-3 flex-wrap'>
					<span
						className={cn(
							'text-xs px-2 py-1 rounded-full bg-primary/40 dark:bg-primary/55 text-primary-foreground',
							course.accessType.toLowerCase() !== 'free' &&
								'bg-muted-foreground dark:bg-muted-foreground text-white'
						)}
					>
						Free
					</span>
					<span
						className={cn(
							'text-xs px-2 py-1 rounded-full bg-primary/40 dark:bg-primary/55 text-primary-foreground',
							course.accessType.toLowerCase() !== 'pro' &&
								'bg-muted-foreground dark:bg-muted-foreground text-white'
						)}
					>
						Pro
					</span>
				</div>

				{/* Last Accessed Info */}
				{hasProgress && course.lastAccessedAt && (
					<div className='text-xs text-muted-foreground mb-2'>
						Last accessed:{' '}
						{new Date(course.lastAccessedAt).toLocaleDateString()}
					</div>
				)}

				{/* Description */}
				<p className='line-clamp-2 sm:line-clamp-3 text-xs sm:text-sm text-muted-foreground'>
					{course?.description}
				</p>
			</div>
		</Link>
	);
}

// Progress Bar Component
function ProgressBar({
	percentage,
	className,
	showText = true,
}: {
	percentage: number;
	className?: string;
	showText?: boolean;
}) {
	return (
		<div className={cn('w-full', className)}>
			{showText && (
				<div className='flex justify-between items-center mb-1'>
					<span className='text-xs text-muted-foreground'>Progress</span>
					<span className='text-xs font-medium text-primary'>
						{percentage}%
					</span>
				</div>
			)}
			<div className='w-full bg-muted/40 rounded-full h-2 overflow-hidden'>
				<div
					className='h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-500 ease-out'
					style={{ width: `${Math.min(percentage, 100)}%` }}
				/>
			</div>
		</div>
	);
}

// Course Status Badge
function CourseStatus({
	isCompleted,
	progressPercentage,
}: {
	isCompleted: boolean;
	progressPercentage: number;
}) {
	if (isCompleted) {
		return (
			<span className='inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-medium'>
				<div className='w-1.5 h-1.5 bg-green-600 rounded-full' />
				Completed
			</span>
		);
	}

	if (progressPercentage > 0) {
		return (
			<span className='inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium'>
				<div className='w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse' />
				In Progress
			</span>
		);
	}

	return null;
}
