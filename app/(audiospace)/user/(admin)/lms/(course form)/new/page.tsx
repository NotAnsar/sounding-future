import { getTopics } from '@/db/topic';
import { getSeries } from '@/db/serie';
import { getInstructors } from '@/db/instructor';
import CourseForm from '@/components/LMS/course/CourseForm';
import Error from '@/components/Error';
import BreadCrumb from '@/components/BreadCrumb';

export const metadata = {
	title: 'Add New Course - LMS',
	description: 'Create a new course in the learning management system',
};

export default async function NewCoursePage() {
	const [instructors, topics, series] = await Promise.all([
		getInstructors(),
		getTopics(),
		getSeries(),
	]);

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
					{ link: '/user/lms', text: 'Courses' },

					{
						link: '/user/lms/new',
						text: 'Add Course',
						isCurrent: true,
					},
				]}
			/>

			<CourseForm
				instructors={instructors.data}
				topics={topics.data}
				series={series.data}
			/>
		</div>
	);
}
