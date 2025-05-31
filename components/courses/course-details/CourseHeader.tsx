import { CourseWithRelations } from '@/db/course';
import { cn, formatCourseDuration } from '@/lib/utils';
import { BookOpen, CircleGauge, Clock4, Play } from 'lucide-react';

interface CourseHeaderProps {
	course: CourseWithRelations;
	isAuthenticated?: boolean;
	progressData?: {
		completionPercentage: number;
		completedCount: number;
		totalChapters: number;
	};
}

export default function CourseHeader({
	course,
	isAuthenticated = false,
	progressData = {
		completionPercentage: 0,
		completedCount: 0,
		totalChapters: course.chapters.filter((c) => c.published).length,
	},
}: CourseHeaderProps) {
	return (
		<div className='px-4 sm:px-6 lg:px-8 py-4 sm:py-8 dark:bg-[#141B29] bg-secondary rounded-2xl'>
			<div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-2'>
				<div>
					<h2 className='text-4xl font-bold'>{course.title}</h2>
					{course?.series?.name && (
						<h4 className='text-lg font-medium'>{course?.series.name}</h4>
					)}
				</div>

				{isAuthenticated && (
					<div className='w-full sm:w-64 items-center justify-center sm:justify-end hidden md:flex'>
						<div className='relative hidden items-center justify-center md:flex'>
							<svg className='w-16 h-16 transform ' viewBox='0 0 36 36'>
								<path
									className='dark:text-gray-200 text-zinc-400 '
									stroke='currentColor'
									strokeWidth='3'
									fill='transparent'
									d='M18 2.0845
					a 15.9155 15.9155 0 0 1 0 31.831
					a 15.9155 15.9155 0 0 1 0 -31.831'
								/>
								{progressData.completionPercentage > 0 && (
									<path
										className='text-primary'
										stroke='currentColor'
										strokeWidth='3'
										strokeDasharray={`${progressData.completionPercentage}, 100`}
										strokeLinecap='round'
										fill='transparent'
										d='M18 2.0845
					a 15.9155 15.9155 0 0 1 0 31.831
					a 15.9155 15.9155 0 0 1 0 -31.831'
									/>
								)}
							</svg>
							<div className='absolute inset-0 flex items-center justify-center'>
								<span className='text-sm font-medium'>
									{progressData.completionPercentage}%
								</span>
							</div>
						</div>
					</div>
				)}
			</div>

			<div className='flex gap-x-3 gap-y-1 font-medium my-1.5 text-[15px] flex-wrap'>
				<div className='flex items-center gap-2'>
					<BookOpen className='w-4 h-auto aspect-square ' />
					<span>{course.chapters.map((c) => c.published).length} Chapters</span>
				</div>
				<div className='flex items-center gap-2'>
					<Clock4 className='w-4 h-auto aspect-square ' />
					<span>
						{formatCourseDuration(
							course.chapters.reduce(
								(total, chapter) => total + (chapter.videoDuration || 0),
								0
							)
						)}
					</span>
				</div>
				<div className='flex items-center gap-2'>
					<CircleGauge className='w-4 h-auto aspect-square ' />
					<span>{course.level}</span>
				</div>
				<div className='flex items-center gap-3 my-2 flex-wrap'>
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

				{course._count.courseProgress > 0 && (
					<div className='flex items-center gap-2 ml-auto'>
						<Play className='w-4 h-auto aspect-square ' />
						<span>{course._count.courseProgress}</span>
					</div>
				)}
			</div>

			<div className='flex md:hidden items-center gap-2 w-full mt-2'>
				<Clock4 className='w-4 h-4' />
				<div className='flex-1 dark:bg-gray-200 bg-zinc-400 rounded-full h-2'>
					<div
						className='bg-primary h-2 rounded-full'
						style={{ width: `${progressData.completionPercentage}%` }}
					/>
				</div>
				<span className='text-sm font-medium'>
					{isAuthenticated ? `${progressData.completionPercentage}%` : '0%'}
				</span>
			</div>
		</div>
	);
}
