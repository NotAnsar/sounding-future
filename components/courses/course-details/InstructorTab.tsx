import { CourseDetails } from '@/db/course';
import { TabsContent } from '@/components/ui/tabs';
import { Icons } from '@/components/icons/audio-player';
import Image from 'next/image';
import { getChapterById } from '@/db/chapter';
import Link from 'next/link';

export default async function InstructorTab({
	course,
	currentChapterId,
}: {
	course: CourseDetails;
	currentChapterId: string;
}) {
	return (
		<TabsContent value='instructor' className='space-y-10'>
			<InstructorSection ChapterId={currentChapterId} />

			{course.credits && <CreditsSection credits={course.credits} />}
		</TabsContent>
	);
}

function CreditsSection({ credits }: { credits: string }) {
	return (
		<div className='p-6 pb-9 bg-secondary rounded-lg mb-4'>
			<div className='flex gap-3 items-center'>
				<Icons.credits className='w-7 h-auto aspect-square text-primary-foreground min-w-7 max-w-7' />
				<h1 className='text-xl sm:text-2xl font-bold text-primary-foreground'>
					Credits
				</h1>
			</div>
			<p className='mt-8 text-pretty leading-7 whitespace-pre-line'>
				{credits}
			</p>
		</div>
	);
}

async function InstructorSection({ ChapterId }: { ChapterId: string }) {
	const { data } = await getChapterById(ChapterId);

	await new Promise((resolve) => setTimeout(resolve, 3000)); // Simulate loading delay

	if (!data) return null;

	// Extract other courses more efficiently
	const otherCourses = data.instructors
		.flatMap(({ instructor }) =>
			instructor.courses
				.filter((c) => c.course.published && c.course.slug !== data.course.slug)
				.map((c) => c.course)
		)
		.filter(
			(course, index, array) =>
				array.findIndex((c) => c.slug === course.slug) === index
		);

	return (
		<div className='p-6 pb-9 bg-secondary rounded-lg mb-4'>
			<div className='flex gap-3 items-center'>
				<Icons.profile className='w-7 h-auto aspect-square text-primary-foreground min-w-7 max-w-7' />
				<h1 className='text-xl sm:text-2xl font-bold text-primary-foreground'>
					About the Instructor{data.instructors.length > 1 ? 's' : ''}
				</h1>
			</div>
			<div className='mt-4 space-y-8'>
				{data.instructors.map((instructorData, index) => (
					<div
						key={index}
						className='flex gap-6 flex-col lg:flex-row items-start '
					>
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
							<h3 className='md:text-lg lg:text-xl font-semibold mb-2'>
								{instructorData.instructor.name}
							</h3>
							<p className='text-sm md:text-base  leading-relaxed'>
								{instructorData.instructor.bio}
							</p>
						</div>
					</div>
				))}

				{otherCourses.length > 0 && (
					<div>
						<p className='text-lg font-semibold'>
							Other courses by{' '}
							{data.instructors.map((i) => i.instructor.name).join(', ')}:
						</p>
						<div className='mt-2 space-y-1'>
							{otherCourses.map((course) => (
								<Link
									href={`/courses/${course.slug}`}
									className='hover:underline block'
									key={course.slug}
								>
									{course.title}
								</Link>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
