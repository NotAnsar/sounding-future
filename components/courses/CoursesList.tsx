'use client';

import { useEffect, useState } from 'react';
import { CourseWithRelations } from '@/db/course';
import CoursesCard, { CoursesListCard } from './CoursesCard';
import { getBatchCurrentChapters } from '@/actions/lms/course-action';

interface CoursesListProps {
	courses: CourseWithRelations[];
	isTable: boolean;
	enableChapterLinks?: boolean;
}

interface CourseWithChapter extends CourseWithRelations {
	currentChapterSlug?: string;
}

export default function CoursesList({
	courses,
	isTable,
	enableChapterLinks = false,
}: CoursesListProps) {
	// Optimistic updates: Start with courses immediately, enhance later
	const [coursesWithChapters, setCoursesWithChapters] = useState<
		CourseWithChapter[]
	>(() =>
		courses.map((course) => ({
			...course,
			currentChapterSlug: undefined,
		}))
	);

	useEffect(() => {
		if (!enableChapterLinks) return;

		async function loadCurrentChapters() {
			try {
				const courseIds = courses.map((c) => c.id);

				// Single query for ALL current chapters!
				const currentChapters = await getBatchCurrentChapters(courseIds);

				setCoursesWithChapters(
					courses.map((course) => ({
						...course,
						currentChapterSlug: currentChapters[course.id],
					}))
				);
			} catch (error) {
				console.error('Failed to load current chapters:', error);
				// Keep showing courses even if chapter links fail
			}
		}

		loadCurrentChapters();
	}, [courses, enableChapterLinks]);

	if (isTable) {
		return (
			<div className='grid grid-cols-1 gap-4'>
				{coursesWithChapters.map((course) => (
					<CoursesListCard
						key={course.id && course.currentChapterSlug}
						course={course}
					/>
				))}
			</div>
		);
	}

	return (
		<div className='grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 sm:gap-x-6 sm:gap-y-10 2xl:gap-x-10'>
			{coursesWithChapters.map((course) => (
				<CoursesCard key={course.id} course={course} />
			))}
		</div>
	);
}
