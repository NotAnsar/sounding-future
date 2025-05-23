import { getCourseById } from '@/db/course';
import { getTopics } from '@/db/topic';
import { getSeries } from '@/db/serie';
import { getInstructors } from '@/db/instructor';
import CourseForm from '@/components/LMS/course/CourseForm';
import Error from '@/components/Error';
import { notFound } from 'next/navigation';
import BreadCrumb from '@/components/BreadCrumb';

export const metadata = {
	title: 'Edit Course - LMS',
	description: 'Edit an existing course in the learning management system',
};

export default async function EditCoursePage({
	params,
}: {
	params: { id: string };
}) {
	const { id } = params;

	const [course, instructors, topics, series] = await Promise.all([
		getCourseById(id),
		getInstructors(),
		getTopics(),
		getSeries(),
	]);

	if (course.error || !course.data) {
		return notFound();
	}

	if (instructors.error) {
		return (
			<Error message={instructors.message || 'Error loading instructors'} />
		);
	}

	if (topics.error) {
		return <Error message={topics.message || 'Error loading course topics'} />;
	}

	if (series.error) {
		return <Error message={series.message || 'Error loading course series'} />;
	}

	return (
		<div className='mt-4'>
			<BreadCrumb
				items={[
					{ link: `/user/lms`, text: 'Courses' },
					{
						link: `/user/lms/edit/${id}`,
						text: 'Edit Course',
						isCurrent: true,
					},
				]}
			/>

			<CourseForm
				initialData={course.data}
				instructors={instructors.data}
				topics={topics.data}
				series={series.data}
			/>
		</div>
	);
}
