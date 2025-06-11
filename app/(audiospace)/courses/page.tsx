import HeaderBanner from '@/components/HeaderBanner';
import React from 'react';
import { getCourses } from '@/db/course';
import { Tabs } from '@/components/ui/tabs';
import CoursesNav from '@/components/courses/CoursesNav';
import { getTopics } from '@/db/topic';
import Error from '@/components/Error';
import CoursesList from '@/components/courses/CoursesList';
import CoursesProOnly from '@/components/courses/CoursesProOnly';

export async function generateMetadata() {
	const courses = await getCourses(true);

	if (courses.error) {
		return { title: 'Courses Not Found' };
	}

	return {
		title: 'Courses - Master music creation  with our courses',
		description: 'Explore our collection of innovative audio courses',
		openGraph: {
			title: 'Courses - Master music creation with our courses',
			description: 'Explore our collection of innovative audio courses',
			images: ['/banners/courses.jpg'],
			type: 'website',
		},
	};
}

export default async function page({
	searchParams: { type, sort },
}: {
	searchParams: { type: string; sort: string };
}) {
	const isTable = type === 'table';
	const tabValue = sort || 'all';
	const [topics, courses] = await Promise.all([getTopics(), getCourses(true)]);

	if (topics.error || !topics.data) return <Error message={topics.message} />;
	if (courses.error || !courses.data)
		return <Error message={courses.message} />;

	const data = [
		{ label: 'All', link: 'all' },
		...topics.data.map((t) => ({ label: t.name, link: t.slug })),
	];

	if (!data.find((t) => t.link === sort)) sort = 'all';
	const filteredCourses = courses.data.filter(
		(c) => c.topics.some((topic) => topic.topic.slug === sort) || sort === 'all'
	);

	return (
		<>
			<HeaderBanner
				img={'/banners/sign-up.jpg'}
				title='Master music creation  with our courses'
				titleClassName='font-bold md:text-4xl lg:text-5xl '
			/>
			<Tabs value={tabValue} className='mt-4 sm:mt-8 grid gap-2 sm:gap-3'>
				<CoursesNav type={type} sort={sort} topics={data} />
				{filteredCourses.length === 0 && (
					<p className='text-muted-foreground text-center my-8'>
						No courses found for this topic.
					</p>
				)}

				{filteredCourses.length > 0 && (
					<CoursesList
						courses={filteredCourses}
						isTable={isTable}
						enableChapterLinks={true} // ADD THIS LINE
					/>
				)}
			</Tabs>
			<CoursesProOnly className='mt-8' />
		</>
	);
}
