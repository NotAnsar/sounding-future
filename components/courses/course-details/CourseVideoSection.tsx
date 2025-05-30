'use client';

import { CourseWithRelations } from '@/db/course';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useTransition } from 'react';
import VideoPlayerCourse from '../VideoPlayerCourse';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

interface CourseVideoSectionProps {
	course: CourseWithRelations;
	currentChapter: CourseWithRelations['chapters'][number] | null;
	currentChapterIndex: number;
	isAuth?: boolean;
}

export default function CourseVideoSection({
	course,
	currentChapter,
	currentChapterIndex,
	isAuth,
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

			{isAuth ? (
				<div className='aspect-video relative w-full mt-2 rounded-2xl overflow-hidden border-2'>
					{currentChapter ? (
						<>
							<VideoPlayerCourse
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
			) : (
				<AuthGate />
			)}

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

const AuthGate = () => (
	<div className='bg-secondary flex items-center justify-center sm:aspect-video relative w-full mt-2 rounded-2xl overflow-hidden border-2'>
		<div className='text-center space-y-3 sm:space-y-4 p-4 sm:p-8 max-w-md mx-auto'>
			<div className='w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto'>
				<svg
					className='w-6 h-6 sm:w-8 sm:h-8 text-primary'
					fill='none'
					stroke='currentColor'
					viewBox='0 0 24 24'
				>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={2}
						d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
					/>
				</svg>
			</div>
			<div className='space-y-2 sm:space-y-3'>
				<h3 className='text-lg sm:text-xl font-semibold'>Sign in to watch</h3>
				<p className='text-muted-foreground text-sm sm:text-base leading-relaxed'>
					You need to be signed in to access course videos
				</p>
				<div className='flex flex-col sm:flex-row items-center gap-2 sm:gap-3 justify-center pt-1'>
					<Link
						href='/login'
						className={cn(
							buttonVariants({ variant: 'default', size: 'sm' }),
							'w-full sm:w-auto min-w-[100px]'
						)}
					>
						Login
					</Link>
					<Link
						href='/signup'
						className={cn(
							buttonVariants({ variant: 'secondary', size: 'sm' }),
							'w-full sm:w-auto min-w-[100px]'
						)}
					>
						Sign Up
					</Link>
				</div>
			</div>
		</div>
	</div>
);
