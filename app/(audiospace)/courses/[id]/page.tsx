import Error from '@/components/Error';
import { getCourseBySlug } from '@/db/course';
import { Metadata } from 'next';

import CoursesDetailsNav from '@/components/courses/course-details/CoursesDetailsNav';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import VideoPlayer from '@/components/VideoPlayer';
import CourseHeader from '@/components/courses/course-details/CourseHeader';
import { Icons } from '@/components/icons/audio-player';
import { cn, formatTime } from '@/lib/utils';
import { Check } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

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

			<div className='aspect-video relative w-full mt-2 rounded-2xl overflow-hidden border-2'>
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
				<TabsContent value='learnings' className='space-y-10'>
					<div className='p-6 pb-9 bg-secondary rounded-lg mb-4'>
						<div className='flex gap-3 items-center'>
							<Icons.learning className='w-7 h-auto aspect-square text-primary-foreground min-w-7 max-w-7' />
							<h1 className='text-xl sm:text-2xl font-bold text-primary-foreground'>
								What you will learn in this course
							</h1>
						</div>
						<div className='grid md:grid-cols-2 gap-x-5	gap-y-8 mt-8'>
							{course.learnings.map((learning, index) => (
								<div key={index} className='flex gap-3.5 text-foreground'>
									<div className='w-8 h-8 rounded-md bg-white flex items-center justify-center flex-shrink-0'>
										<Check className='w-6 h-6 text-black' />
									</div>
									<span>{learning}</span>
								</div>
							))}
						</div>
					</div>
					{course.skills && (
						<div className='p-6 pb-9 bg-secondary rounded-lg mb-4'>
							<div className='flex gap-3 items-center'>
								<Icons.skills className='w-7 h-auto aspect-square text-primary-foreground min-w-7 max-w-7' />
								<h1 className='text-xl sm:texttext-2xl font-bold text-primary-foreground'>
									What skills and tools you need for this course
								</h1>
							</div>
							<p className='mt-8 text-pretty leading-7 whitespace-pre-line'>
								{course.skills}
							</p>
						</div>
					)}
				</TabsContent>
				<TabsContent value='instructor' className='space-y-10'>
					<div className='p-6 pb-9 bg-secondary rounded-lg mb-4'>
						<div className='flex gap-3 items-center'>
							<Icons.profile className='w-7 h-auto aspect-square text-primary-foreground min-w-7 max-w-7' />
							<h1 className='text-xl sm:text-2xl font-bold text-primary-foreground'>
								About the Instructor{course.instructors.length > 1 ? 's' : ''}
							</h1>
						</div>
						<div className='space-y-8 mt-8'>
							{course.instructors.map((instructorData, index) => (
								<div key={index} className='flex gap-6'>
									<div className='w-44 relative'>
										{instructorData.instructor.image ? (
											<Image
												src={instructorData.instructor.image}
												alt={instructorData.instructor.name}
												width={222}
												height={222}
												className='min-w-44 max-w-44 h-auto aspect-square object-cover border border-border rounded-full'
											/>
										) : (
											<div className='min-w-44 max-w-44 h-auto aspect-square object-cover transition-all hover:scale-105 cursor-pointer border-border bg-muted rounded-full' />
										)}
									</div>
									<div>
										<h3 className='text-xl font-semibold mb-2'>
											{instructorData.instructor.name}
										</h3>
										<p className='text-lg leading-relaxed'>
											{instructorData.instructor.bio}
										</p>
									</div>
								</div>
							))}
							<div>
								<p className='text-lg font-semibold'>
									Other courses of{' '}
									{course.instructors.map((i) => i.instructor.name).join(', ')}{' '}
									:
								</p>

								<div className='mt-2 space-y-1'>
									{Array.from(
										new Set(
											course.instructors
												.map(({ instructor }) =>
													instructor.courses.map((c) => c.course.slug)
												)
												.flat()
										)
									)
										.filter((slug) => slug !== course.slug) // Remove current course
										.map((slug) => {
											// Find the course data for this unique slug
											const courseData = course.instructors
												.map(({ instructor }) => instructor.courses)
												.flat()
												.find((c) => c.course.slug === slug)?.course;

											return courseData ? (
												<Link
													href={`/courses/${courseData.slug}`}
													className='hover:underline block'
													key={courseData.slug}
												>
													{courseData.title}
												</Link>
											) : null;
										})
										.filter(Boolean)}
								</div>
							</div>
						</div>
					</div>
					{course.credits && (
						<div className='p-6 pb-9 bg-secondary rounded-lg mb-4'>
							<div className='flex gap-3 items-center'>
								<Icons.credits className='w-7 h-auto aspect-square text-primary-foreground min-w-7 max-w-7' />
								<h1 className='text-xl sm:text-2xl font-bold text-primary-foreground'>
									Credits
								</h1>
							</div>
							<p className='mt-8 text-pretty leading-7 whitespace-pre-line'>
								{course.credits}
							</p>
						</div>
					)}
				</TabsContent>
			</Tabs>
		</div>
	);
}
