'use client';

import { Icons } from '@/components/icons/audio-player';
import { CourseWithRelations } from '@/db/course';
import { toast } from '@/hooks/use-toast';
import { cn, formatTime } from '@/lib/utils';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useTransition, useState } from 'react';

interface CourseChapterListProps {
	course: CourseWithRelations;
	currentChapterIndex: number;
	canAccessPro?: boolean;
	isAuthenticated?: boolean;
	completedChapters?: string[];
}

export default function CourseChapterList2({
	course,
	currentChapterIndex,
	canAccessPro = false,
	isAuthenticated = false,
	completedChapters = [],
}: CourseChapterListProps) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [isPending, startTransition] = useTransition();
	const [downloadingChapter, setDownloadingChapter] = useState<string | null>(
		null
	);

	const handleChapterClick = (chapterSlug: string, hasAccess: boolean) => {
		if (!hasAccess) {
			toast({
				title: 'Pro subscription required',
				description: 'This chapter is only available to Pro subscribers',
				variant: 'destructive',
			});
			return;
		}

		startTransition(() => {
			const params = new URLSearchParams(searchParams);
			params.set('chapter', chapterSlug);

			router.replace(`${pathname}?${params.toString()}`, {
				scroll: false,
			});
		});
	};

	const downloadFile = async (originalUrl: string, filename?: string) => {
		try {
			const fileId = originalUrl.split('/').pop();
			if (!fileId) throw new Error('Invalid file URL');

			const proxyUrl = `/api/download/${fileId}`;
			const response = await fetch(proxyUrl);
			if (!response.ok) throw new Error('Download failed');

			const blob = await response.blob();
			const downloadUrl = window.URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = downloadUrl;
			link.download = filename || fileId;
			document.body.appendChild(link);
			link.click();
			link.remove();
			window.URL.revokeObjectURL(downloadUrl);
		} catch (error) {
			console.error('Download failed:', error);
			throw error;
		}
	};

	const handleDownloadAll = async (
		chapter: CourseWithRelations['chapters'][number],
		hasAccess: boolean
	) => {
		if (!hasAccess) {
			toast({
				title: 'Pro subscription required',
				description:
					'Downloads are only available to Pro subscribers for this chapter',
				variant: 'destructive',
			});
			return;
		}

		if (!chapter.downloads || chapter.downloads.length === 0) {
			toast({
				title: 'No downloads available for this chapter',
				variant: 'destructive',
			});
			return;
		}

		if (downloadingChapter === chapter.id) return;

		setDownloadingChapter(chapter.id);

		try {
			toast({
				title: `Downloading ${chapter.downloads.length} file(s)...`,
			});

			for (let i = 0; i < chapter.downloads.length; i++) {
				const downloadUrl = chapter.downloads[i];
				const filename = `${chapter.title}-file-${i + 1}${getFileExtension(
					downloadUrl
				)}`;
				await downloadFile(downloadUrl, filename);

				if (i < chapter.downloads.length - 1) {
					await new Promise((resolve) => setTimeout(resolve, 500));
				}
			}
			toast({
				title: `Successfully downloaded ${chapter.downloads.length} file(s)`,
			});
		} catch (error) {
			console.error('Download failed:', error);
			toast({
				title: 'Failed to download some files',
				variant: 'destructive',
			});
		} finally {
			setDownloadingChapter(null);
		}
	};

	const getFileExtension = (url: string): string => {
		try {
			const path = new URL(url).pathname;
			const extension = path.split('.').pop();
			return extension ? `.${extension}` : '';
		} catch {
			return '';
		}
	};

	return (
		<div className='h-full flex flex-col border-2 rounded-lg bg-secondary/20 overflow-hidden lg:aspect-video'>
			{/* Fixed Header */}
			<div className='flex-shrink-0 p-3 border-b bg-background/80 backdrop-blur-sm'>
				<h3 className='font-semibold'>Course Content</h3>
				<p className='text-xs text-muted-foreground mt-1'>
					{course.chapters.length} chapters
				</p>
			</div>

			{/* Scrollable Content */}
			<div className='flex-1 overflow-y-auto'>
				<div className={cn('p-2 space-y-1', isPending && 'opacity-70')}>
					{[...course.chapters, ...course.chapters, ...course.chapters].map(
						(chapter, index) => {
							const isProChapter = chapter.accessType?.toLowerCase() === 'pro';
							const hasChapterAccess = !isProChapter || canAccessPro;
							const isCompleted =
								isAuthenticated && completedChapters.includes(chapter.id);

							return (
								<div
									key={chapter.id}
									className={cn(
										'p-2 rounded-lg flex items-center transition-all duration-200 border cursor-pointer text-sm',
										'hover:shadow-sm',
										index === currentChapterIndex
											? 'bg-primary/10 border-primary/30 shadow-sm'
											: 'bg-background/70 hover:bg-background/90 border-transparent hover:border-primary/10',
										isPending && 'pointer-events-none',
										!hasChapterAccess && 'opacity-70'
									)}
									onClick={() =>
										handleChapterClick(chapter.slug, hasChapterAccess)
									}
								>
									<div className='flex items-center gap-2 flex-1 min-w-0'>
										{/* Chapter Icon */}
										{!hasChapterAccess ? (
											<div className='w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0'>
												<svg
													className='w-3 h-3 text-primary'
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
										) : index === currentChapterIndex ? (
											<Icons.play className='w-7 h-7 fill-primary flex-shrink-0' />
										) : (
											<div className='w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs font-medium flex-shrink-0'>
												<span className='text-white'>{index + 1}</span>
											</div>
										)}

										{/* Chapter Info */}
										<div className='flex-1 min-w-0'>
											<div className='flex items-center gap-1 mb-0.5'>
												<h4
													className={cn(
														'text-xs font-medium truncate',
														index === currentChapterIndex && 'text-primary'
													)}
												>
													{chapter.title}
												</h4>
												{isProChapter && (
													<span className='text-xs px-1 py-0.5 rounded bg-primary/40 text-primary-foreground border border-primary/45 flex-shrink-0'>
														Pro
													</span>
												)}
												{isCompleted && (
													<span className='text-xs px-1 py-0.5 rounded border-green-600 text-green-600 bg-green-400/40 border flex-shrink-0'>
														✓
													</span>
												)}
											</div>
											{!hasChapterAccess && (
												<p className='text-xs text-primary'>Upgrade to Pro</p>
											)}
										</div>
									</div>

									{/* Right Side Controls */}
									<div className='flex items-center gap-1 ml-1 flex-shrink-0'>
										{chapter.downloads.length > 0 && (
											<button
												type='button'
												onClick={(e) => {
													e.stopPropagation();
													e.preventDefault();
													handleDownloadAll(chapter, hasChapterAccess);
												}}
												disabled={downloadingChapter === chapter.id}
												className={cn(
													'p-1 rounded-full transition-all duration-200 z-10',
													'hover:bg-primary/10 hover:scale-105',
													downloadingChapter === chapter.id
														? 'opacity-50 cursor-not-allowed'
														: hasChapterAccess
														? 'cursor-pointer'
														: 'opacity-50 cursor-not-allowed'
												)}
											>
												{downloadingChapter === chapter.id ? (
													<div className='w-3 h-3 animate-spin rounded-full border border-primary border-t-transparent' />
												) : !hasChapterAccess ? (
													<svg
														className='w-3 h-3 text-primary'
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
												) : (
													<Icons.download className='w-3 h-3 text-foreground hover:text-primary transition-colors' />
												)}
											</button>
										)}

										<div className='text-right flex gap-1 items-center'>
											<p className='text-xs text-muted-foreground'>
												{formatTime(chapter.videoDuration || 0)}
											</p>
											{index === currentChapterIndex && (
												<div className='w-1 h-1 bg-primary rounded-full animate-pulse mx-auto mt-0.5' />
											)}
										</div>
									</div>
								</div>
							);
						}
					)}
				</div>
			</div>
		</div>
	);
}
