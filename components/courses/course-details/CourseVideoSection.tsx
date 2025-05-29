'use client';

import VideoPlayer from '@/components/VideoPlayer';
import { CourseWithRelations } from '@/db/course';

interface CourseVideoSectionProps {
	course: CourseWithRelations;
	currentChapter: CourseWithRelations['chapters'][number] | null;
	currentChapterIndex: number;
}

export default function CourseVideoSection({
	course,
	currentChapter,
	currentChapterIndex,
}: CourseVideoSectionProps) {
	return (
		<div className='space-y-4'>
			{/* Video Player */}
			<div className='aspect-video relative w-full mt-2 rounded-2xl overflow-hidden border-2'>
				{currentChapter ? (
					<VideoPlayer
						src={currentChapter.videoUrl || ''}
						poster={currentChapter.thumbnail || undefined}
						title={currentChapter.title || course.title}
						className='w-full h-full'
					/>
				) : (
					<div className='bg-secondary flex items-center justify-center h-full'>
						<p className='text-muted-foreground'>No chapters available</p>
					</div>
				)}
			</div>

			{/* Current Chapter Info */}
			{currentChapter && (
				<div className='bg-secondary rounded-lg p-4'>
					<div className='flex items-center justify-between '>
						<h2 className='text-xl font-semibold'>{currentChapter.title}</h2>
						<div className='flex items-center gap-2'>
							{currentChapter.accessType?.toLowerCase() === 'pro' && (
								<span className='text-sm px-3 rounded-full bg-primary/40 dark:bg-primary/50 text-primary-foreground py-0.5'>
									Pro
								</span>
							)}
							<span className='text-sm text-muted-foreground'>
								Chapter {currentChapterIndex + 1} of {course.chapters.length}
							</span>
						</div>
					</div>
					{currentChapter.description && (
						<p className='text-muted-foreground text-sm mt-2'>
							{currentChapter.description}
						</p>
					)}
				</div>
			)}
		</div>
	);
}
