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

export default function CourseChapterList({
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
			// Extract file ID from the original URL
			const fileId = originalUrl.split('/').pop();
			if (!fileId) throw new Error('Invalid file URL');

			// Use the proxy endpoint
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

		if (downloadingChapter === chapter.id) {
			return; // Already downloading
		}

		setDownloadingChapter(chapter.id);

		try {
			// Show initial toast
			toast({
				title: `Downloading ${chapter.downloads.length} file(s)...`,
			});

			// Download all files sequentially to avoid overwhelming the browser
			for (let i = 0; i < chapter.downloads.length; i++) {
				const downloadUrl = chapter.downloads[i];
				const filename = `${chapter.title}-file-${i + 1}${getFileExtension(
					downloadUrl
				)}`;

				await downloadFile(downloadUrl, filename);

				// Small delay between downloads
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

	// Helper function to get file extension from URL
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
		<div
			className={cn(
				'space-y-3 transition-opacity duration-300',
				isPending && 'opacity-70'
			)}
		>
			<h3 className='text-lg font-semibold mb-4'>Course Content</h3>
			{course.chapters.map((chapter, index) => {
				const isProChapter = chapter.accessType?.toLowerCase() === 'pro';
				const hasChapterAccess = !isProChapter || canAccessPro;
				const isCompleted =
					isAuthenticated && completedChapters.includes(chapter.id);

				return (
					<div
						key={chapter.id}
						className={cn(
							'px-4 py-5 rounded-lg justify-between flex items-center transition-all duration-300 ease-in-out border-2',
							'hover:shadow-md',
							index === currentChapterIndex
								? 'bg-primary/10 border-primary/20 shadow-sm transform'
								: 'bg-secondary hover:bg-secondary/80 border-transparent',
							isPending && 'pointer-events-none',
							!hasChapterAccess && 'opacity-70' // Dim locked chapters
						)}
						onClick={() => handleChapterClick(chapter.slug, hasChapterAccess)}
					>
						<div className='flex items-center gap-3 cursor-pointer'>
							{/* Show different icons based on status */}
							{!hasChapterAccess ? (
								<div className='w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center'>
									<svg
										className='w-5 h-5 text-primary'
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
								<Icons.play className='w-10 h-10 fill-primary' />
							) : (
								<div
									className={cn(
										'w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300',
										index === currentChapterIndex
											? 'bg-primary text-primary-foreground'
											: 'bg-muted text-muted-foreground'
									)}
								>
									<span className='text-white'>{index + 1}</span>
								</div>
							)}

							<div className='flex-1'>
								<div className='flex items-center gap-2'>
									<h4
										className={cn(
											'text-lg font-medium transition-colors duration-300',
											index === currentChapterIndex && 'text-primary'
										)}
									>
										{chapter.title}
									</h4>
									{isProChapter && (
										<span className='text-xs px-2 py-1 rounded-full bg-primary/40 dark:bg-primary/55 text-primary-foreground border-primary/45 border'>
											Pro
										</span>
									)}
									{isCompleted && (
										<span className='text-xs px-2 py-1 rounded-full border-green-600 text-green-600 bg-green-400/40 dark:bg-green-600/40 border'>
											Completed
										</span>
									)}
								</div>
								{chapter.description && (
									<p className='text-sm text-muted-foreground mt-1 line-clamp-2'>
										{chapter.description}
									</p>
								)}
								{!hasChapterAccess && (
									<p className='text-xs text-primary mt-1'>
										Upgrade to Pro to access this chapter
									</p>
								)}
							</div>
						</div>

						{/* Right side controls - separate from chapter click */}
						<div className='flex items-center gap-3 ml-4'>
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
										'p-2 rounded-full transition-all duration-200 z-10 group',
										'hover:bg-primary/10 hover:scale-110 active:scale-95',
										'focus:outline-none focus:ring-2 focus:ring-primary/20',
										downloadingChapter === chapter.id
											? 'opacity-50 cursor-not-allowed'
											: hasChapterAccess
											? 'cursor-pointer hover:bg-primary/10'
											: 'opacity-50 cursor-not-allowed'
									)}
									title={
										hasChapterAccess
											? `Download ${chapter.downloads.length} file(s)`
											: 'Pro subscription required'
									}
								>
									{downloadingChapter === chapter.id ? (
										<div className='w-[18px] h-[18px] animate-spin rounded-full border-2 border-primary border-t-transparent' />
									) : !hasChapterAccess ? (
										<svg
											className='w-[18px] h-[18px] text-primary'
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
										<Icons.download className='w-[18px] h-[18px] text-foreground group-hover:text-primary transition-colors' />
									)}
								</button>
							)}

							<p className='text-muted-foreground text-sm'>
								{formatTime(chapter.videoDuration || 0)}
							</p>
							{index === currentChapterIndex && (
								<div className='w-2 h-2 bg-primary rounded-full animate-pulse' />
							)}
						</div>
					</div>
				);
			})}
		</div>
	);
}
