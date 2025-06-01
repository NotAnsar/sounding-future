import HeaderBanner from '@/components/HeaderBanner';
import React from 'react';
import { getCourses } from '@/db/course';
import { Tabs } from '@/components/ui/tabs';
import CoursesNav from '@/components/courses/CoursesNav';
import { getTopics } from '@/db/topic';
import Error from '@/components/Error';
import CoursesCard, { CoursesListCard } from '@/components/courses/CoursesCard';

export async function generateMetadata() {
	const courses = await getCourses(true, true);

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
	const [topics, courses] = await Promise.all([
		getTopics(),
		getCourses(true, true),
	]);

	if (topics.error || !topics.data) return <Error message={topics.message} />;
	if (courses.error || !courses.data)
		return <Error message={courses.message} />;

	console.log(
		courses.data.map((c) => ({ name: c.title, cha: c.currentChapterSlug }))
	);

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
				{filteredCourses.length > 0 &&
					(isTable ? (
						<div className='grid grid-cols-1 gap-4'>
							{filteredCourses.map((c) => (
								<>
									<CoursesListCard course={c} key={c.id} />
								</>
							))}
						</div>
					) : (
						<div
							className={
								'grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 sm:gap-x-6 sm:gap-y-10 2xl:gap-x-10 '
							}
						>
							{filteredCourses.map((c) => (
								<CoursesCard course={c} key={c.id} />
							))}
						</div>
					))}
			</Tabs>
		</>
	);
}
