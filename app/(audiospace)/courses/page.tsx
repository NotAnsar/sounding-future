import HeaderBanner from '@/components/HeaderBanner';
import React from 'react';
import { getCourses } from '@/db/course';
import { Tabs } from '@/components/ui/tabs';

export async function generateMetadata() {
	const courses = await getCourses();

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
		// other: {
		// 	'schema:collection-page': JSON.stringify(
		// 		generateArtistsListingSchema(courses.data)
		// 	),
		// },
	};
}

export default async function page({
	searchParams: { type, sort },
}: {
	searchParams: { type: string; sort: string };
}) {
	// const isTable = type === 'table';
	const tabValue = sort === 'popular' ? 'popular' : 'new';
	console.log(type);

	return (
		<>
			<HeaderBanner
				img={'/banners/sign-up.jpg'}
				title='Master music creation  with our courses'
				titleClassName='font-bold md:text-4xl lg:text-5xl '
			/>
			<Tabs
				value={tabValue}
				className='mt-4 sm:mt-8 grid gap-2 sm:gap-3'
			></Tabs>
		</>
	);
}
