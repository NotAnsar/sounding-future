import Error from '@/components/Error';
import { getCourseBySlug } from '@/db/course';
import { Metadata } from 'next';

import CoursesDetailsNav from '@/components/courses/course-details/CoursesDetailsNav';
import { Tabs, TabsContent } from '@/components/ui/tabs';

import VideoPlayer from '@/components/VideoPlayer';
import CourseHeader from '@/components/courses/course-details/CourseHeader';
import { Icons } from '@/components/icons/audio-player';
import { cn, formatTime } from '@/lib/utils';

export async function generateMetadata({
	params,
}: {
	params: { id: string };
}): Promise<Metadata> {
	const course = await getCourseBySlug(params.id);

	if (!course.data) return { title: 'Course Not Found' };

	return {
		title: `${course.data.title} - Course Details`,
		description:
			course.data.description || `Explore the course: ${course.data.title}`,
	};
}

export default async function page({
	params,
	searchParams: { tab },
}: {
	params: { id: string };
	searchParams: { tab: string };
}) {
	const res = await getCourseBySlug(params.id);
	const tabValue = ['content', 'learnings', 'instructor'].includes(tab)
		? tab
		: 'content';

	if (res.error || !res.data) return <Error message={res.message} />;
	const course = res.data;

	return (
		<div className='space-y-6'>
			<CourseHeader course={course} />

			<div className='aspect-video relative w-full mt-2 rounded-lg overflow-hidden border-2'>
				<VideoPlayer
					src={course.chapters[0].videoUrl || ''}
					poster={course.chapters[0].thumbnail || undefined}
					title={course.chapters[0].title || course.title}
					className='w-full h-full'
				/>
			</div>
			<Tabs value={tabValue} className='mt-4 sm:mt-8 grid gap-2 sm:gap-3'>
				<CoursesDetailsNav
					tabs={[
						{ label: 'Course Content', link: 'content' },
						{ label: 'Learnings & Skills', link: 'learnings' },
						{ label: 'Instructor & Credits', link: 'instructor' },
					]}
				/>
				<TabsContent value='content'>
					{course.chapters.map((chapter) => (
						<div
							key={chapter.id}
							className='px-4 py-5 bg-secondary rounded-lg mb-4 justify-between flex items-center'
						>
							<div className='flex items-center gap-2'>
								<Icons.play className='w-6 h-auto aspect-square cursor-pointer text-foreground fill-foreground' />
								<h2 className='text-xl font-medium'>{chapter.title}</h2>
								{chapter.accessType.toLowerCase() === 'pro' && (
									<span
										className={cn(
											'text-sm px-3 rounded-full bg-primary/40 dark:bg-primary/50 text-primary-foreground py-0.5'
										)}
									>
										Pro
									</span>
								)}
							</div>
							<p className='dark:text-muted-foreground text-muted text-[15px]'>
								{formatTime(chapter.videoDuration || 0)}
							</p>
						</div>
					))}
				</TabsContent>
			</Tabs>
		</div>
	);
}
