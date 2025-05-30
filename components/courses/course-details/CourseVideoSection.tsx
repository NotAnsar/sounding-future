'use client';

import VideoPlayer from '@/components/VideoPlayer';
import { CourseWithRelations } from '@/db/course';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useTransition } from 'react';

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
	const router = useRouter();
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const [isPending, startTransition] = useTransition();

	// Auto-next with transition for better UX
	const handleVideoEnd = useCallback(() => {
		const nextChapterIndex = currentChapterIndex + 1;
		const hasNextChapter = nextChapterIndex < course.chapters.length;

		if (hasNextChapter) {
			console.log('Video ended, navigating to next chapter');
			const nextChapter = course.chapters[nextChapterIndex];

			startTransition(() => {
				// Update URL to next chapter
				const params = new URLSearchParams(searchParams);
				params.set('chapter', nextChapter.slug);
				router.replace(`${pathname}?${params.toString()}`, {
					scroll: false,
				});
			});
		}
	}, [currentChapterIndex, course.chapters, router, searchParams, pathname]);

	return (
		<div className='space-y-4'>
			{/* Video Player with loading state */}
			<div className='aspect-video relative w-full mt-2 rounded-2xl overflow-hidden border-2'>
				{currentChapter ? (
					<>
						<VideoPlayer
							src={currentChapter.videoUrl || ''}
							poster={currentChapter.thumbnail || undefined}
							title={currentChapter.title || course.title}
							className='w-full h-full'
							onVideoEnd={handleVideoEnd}
						/>

						{/* Loading overlay during transition */}
						{isPending && (
							<div className='absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm z-10'>
								<div className='text-white text-center'>
									<div className='w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2' />
									<p className='text-sm'>Loading next chapter...</p>
								</div>
							</div>
						)}
					</>
				) : (
					<div className='bg-secondary flex items-center justify-center h-full'>
						<p className='text-muted-foreground'>No chapters available</p>
					</div>
				)}
			</div>

			{/* Current Chapter Info with transition state */}
			{currentChapter && (
				<div
					className={`bg-secondary rounded-lg p-4 transition-opacity duration-300 ${
						isPending ? 'opacity-50' : 'opacity-100'
					}`}
				>
					<div className='flex items-center justify-between'>
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

							{/* Loading indicator */}
							{isPending && (
								<div className='w-4 h-4 border border-primary border-t-transparent rounded-full animate-spin' />
							)}
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
