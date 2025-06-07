'use client';

import VideoPlayerCourse from '../VideoPlayerCourse';
import { CourseDetailsWithMarkers, CourseWithRelations } from '@/db/course';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useTransition, useState } from 'react';
import { cn } from '@/lib/utils';
import CourseChapterList from './CourseChapterTab';
import { AuthGate, ProGate } from './AuthVideo';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CourseVideoSectionProps {
	course: CourseWithRelations;
	currentChapter: CourseDetailsWithMarkers['chapters'][number] | null;
	currentChapterIndex: number;
	isAuth?: boolean;
	canAccessPro?: boolean;
	completedChapters?: string[];
}

export default function CourseVideoSection({
	course,
	currentChapter,
	currentChapterIndex,
	isAuth,
	canAccessPro = false,
	completedChapters = [],
}: CourseVideoSectionProps) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const [isPending, startTransition] = useTransition();

	const isProChapter = currentChapter?.accessType?.toLowerCase() === 'pro';
	const hasAccess = !isProChapter || canAccessPro;

	const isCurrentChapterCompleted =
		isAuth && currentChapter && completedChapters.includes(currentChapter.id);

	const handleVideoEnd = useCallback(() => {
		if (!isAuth || !hasAccess) return;

		const nextChapterIndex = currentChapterIndex + 1;
		const hasNextChapter = nextChapterIndex < course.chapters.length;

		if (hasNextChapter) {
			const nextChapter = course.chapters[nextChapterIndex];

			startTransition(() => {
				const params = new URLSearchParams(searchParams);
				params.set('chapter', nextChapter.slug);
				router.replace(`${pathname}?${params.toString()}`, {
					scroll: false,
				});
			});
		}
	}, [
		currentChapterIndex,
		course.chapters,
		router,
		searchParams,
		pathname,
		isAuth,
		hasAccess,
	]);

	return (
		<div className='space-y-4'>
			{!isAuth ? (
				<AuthGate />
			) : !hasAccess ? (
				<ProGate />
			) : (
				<>
					{currentChapter ? (
						<CourseVideoPlayer
							course={course}
							currentChapter={currentChapter}
							currentChapterIndex={currentChapterIndex}
							isAuth={isAuth}
							canAccessPro={canAccessPro}
							completedChapters={completedChapters}
							onVideoEnd={handleVideoEnd}
							isPending={isPending}
						/>
					) : (
						<div className='aspect-video relative w-full mt-2 rounded-2xl overflow-hidden border-2'>
							<div className='bg-secondary flex items-center justify-center h-full'>
								<p className='text-muted-foreground'>No chapters available</p>
							</div>
						</div>
					)}
				</>
			)}

			{/* Chapter Info */}
			{currentChapter && (
				<div
					className={`bg-secondary rounded-lg p-4 transition-opacity duration-300 ${
						isPending ? 'opacity-50' : 'opacity-100'
					}`}
				>
					<div className='flex items-center justify-between'>
						<h2 className='text-xl font-semibold'>{currentChapter.title}</h2>
						<div className='flex items-center gap-2'>
							{isProChapter && (
								<span className='text-sm px-3 rounded-full bg-primary/30 dark:bg-primary/55 text-primary-foreground border-primary/45 border'>
									Pro Only
								</span>
							)}
							{isCurrentChapterCompleted && (
								<span className='text-sm px-3 rounded-full border-green-600 text-green-600 bg-green-400/40 dark:bg-green-600/40 border'>
									Completed
								</span>
							)}
							<span className='text-sm text-muted-foreground'>
								Chapter {currentChapterIndex + 1} of {course.chapters.length}
							</span>
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

interface CourseVideoPlayerProps {
	course: CourseWithRelations;
	currentChapter: CourseDetailsWithMarkers['chapters'][number];
	currentChapterIndex: number;
	isAuth: boolean;
	canAccessPro: boolean;
	completedChapters: string[];
	onVideoEnd: () => void;
	isPending: boolean;
}

export function CourseVideoPlayer({
	course,
	currentChapter,
	currentChapterIndex,
	isAuth,
	canAccessPro,
	completedChapters,
	onVideoEnd,
	isPending,
}: CourseVideoPlayerProps) {
	const [showChapterList, setShowChapterList] = useState(true);

	return (
		<div className='relative'>
			<button
				onClick={() => setShowChapterList(!showChapterList)}
				className='absolute top-4 right-4 z-10 bg-button hover:bg-button/70 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm'
				title={showChapterList ? 'Hide chapter list' : 'Show chapter list'}
			>
				{showChapterList ? (
					<ChevronRight className='w-4 h-4' />
				) : (
					<ChevronLeft className='w-4 h-4' />
				)}
			</button>

			<div
				className={cn(
					'transition-all duration-300',
					showChapterList ? 'grid xl:grid-cols-2 gap-4' : 'grid grid-cols-1'
				)}
				style={{
					gridTemplateRows: showChapterList ? 'minmax(0, 1fr)' : 'auto',
				}}
			>
				<div
					className={cn(
						'transition-all duration-300',
						showChapterList ? 'col-span-1' : 'col-span-1'
					)}
				>
					<VideoPlayerCourse
						className='w-full h-full'
						onVideoEnd={onVideoEnd}
						currentChapter={currentChapter}
						isAuthenticated={isAuth}
						isPending={isPending}
					/>
				</div>

				{showChapterList && (
					<div className='col-span-1'>
						<CourseChapterList
							course={course}
							currentChapterIndex={currentChapterIndex}
							canAccessPro={canAccessPro}
							completedChapters={completedChapters}
							isAuthenticated={isAuth}
						/>
					</div>
				)}
			</div>
		</div>
	);
}
