import { CourseDetails } from '@/db/course';
import { TabsContent } from '@/components/ui/tabs';
import { Icons } from '@/components/icons/audio-player';

import Image from 'next/image';
import Link from 'next/link';

export default function InstructorTab({ course }: { course: CourseDetails }) {
	return (
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
							{course.instructors.map((i) => i.instructor.name).join(', ')} :
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
	);
}
