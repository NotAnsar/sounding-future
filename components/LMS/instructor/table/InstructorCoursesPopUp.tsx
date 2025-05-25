'use client';

import { useState } from 'react';
import { Eye, Loader, BookOpen, PlayCircle } from 'lucide-react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { toast } from '@/hooks/use-toast';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { InstructorChaptersAndCourses } from '@/db/instructor';
import { getInstructorCoursesAction } from '@/actions/lms/instructor-action';

export default function InstructorCoursesPopUp({
	instructorId,
	coursesCount,
	chaptersCount,
}: {
	instructorId: string;
	coursesCount: number;
	chaptersCount: number;
}) {
	const count = coursesCount + chaptersCount;
	const [isLoading, setIsLoading] = useState(false);
	const [data, setData] = useState<InstructorChaptersAndCourses | null>(null);

	const handleOpenChange = async (open: boolean) => {
		if (open && count > 0 && !data) {
			try {
				setIsLoading(true);
				const result = await getInstructorCoursesAction(instructorId);
				if (result.success && result.data) {
					setData(result.data);
				} else {
					throw new Error(result.error || 'Failed to fetch data');
				}
			} catch (error) {
				toast({
					title: 'Failed to fetch courses',
					description: 'Please try again later',
					variant: 'destructive',
				});
			} finally {
				setIsLoading(false);
			}
		}
	};

	return (
		<Dialog onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>
				<button disabled={count === 0} className='hover:opacity-80'>
					<Badge variant='secondary'>
						{coursesCount} courses, {chaptersCount} chapters
					</Badge>
				</button>
			</DialogTrigger>

			<DialogContent className='max-w-xl h-[60vh] flex flex-col p-0'>
				<DialogHeader className='p-4 border-b'>
					<DialogTitle>Instructor Assignments</DialogTitle>
				</DialogHeader>

				<div className='flex-1 overflow-y-auto p-4'>
					{isLoading ? (
						<div className='flex items-center justify-center h-full'>
							<Loader className='h-5 w-5 animate-spin' />
						</div>
					) : !data?.courses.length && !data?.chapters.length ? (
						<p className='text-muted-foreground text-center py-8'>
							No assignments yet
						</p>
					) : (
						<div className='space-y-4'>
							{/* Full Courses */}
							{data?.courses.length > 0 && (
								<div>
									<h3 className='text-sm font-medium mb-2 flex items-center gap-2'>
										<BookOpen className='w-4 h-4' />
										Full Courses ({data.courses.length})
									</h3>
									<div className='space-y-2'>
										{data.courses.map(({ course }) => (
											<div
												key={course.id}
												className='flex items-center gap-3 p-2 border rounded'
											>
												{course.thumbnail ? (
													<Image
														src={course.thumbnail}
														alt={course.title}
														width={40}
														height={40}
														className='w-10 h-10 rounded object-cover'
													/>
												) : (
													<div className='w-10 h-10 rounded bg-muted flex items-center justify-center'>
														<BookOpen className='w-4 h-4' />
													</div>
												)}
												<div className='flex-1 min-w-0'>
													<p className='font-medium text-sm line-clamp-1'>
														{course.title}
													</p>
													<p className='text-xs text-muted-foreground'>
														{course.chapters.length} chapters
													</p>
												</div>
												<Link
													href={`/user/lms/courses/edit/${course.id}`}
													className={cn(
														buttonVariants({ size: 'sm', variant: 'outline' })
													)}
												>
													<Eye className='w-3 h-3' />
												</Link>
											</div>
										))}
									</div>
								</div>
							)}

							{/* Individual Chapters */}
							{data?.chapters.length > 0 && (
								<div>
									<h3 className='text-sm font-medium mb-2 flex items-center gap-2'>
										<PlayCircle className='w-4 h-4' />
										Individual Chapters ({data.chapters.length})
									</h3>
									<div className='space-y-2'>
										{data.chapters.map(({ chapter }) => (
											<div
												key={chapter.id}
												className='flex items-center gap-3 p-2 border rounded'
											>
												{chapter.course.thumbnail ? (
													<Image
														src={chapter.course.thumbnail}
														alt={chapter.course.title}
														width={40}
														height={40}
														className='w-10 h-10 rounded object-cover'
													/>
												) : (
													<div className='w-10 h-10 rounded bg-muted flex items-center justify-center'>
														<PlayCircle className='w-4 h-4' />
													</div>
												)}
												<div className='flex-1 min-w-0'>
													<p className='font-medium text-sm line-clamp-1'>
														{chapter.course.title}
													</p>
													<p className='text-xs text-muted-foreground'>
														Chapter: {chapter.title}
													</p>
												</div>
												<Link
													href={`/user/lms/chapters/edit/${chapter.id}`}
													className={cn(
														buttonVariants({ size: 'sm', variant: 'outline' })
													)}
												>
													<Eye className='w-3 h-3' />
												</Link>
											</div>
										))}
									</div>
								</div>
							)}
						</div>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
