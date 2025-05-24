import { getCourses } from '@/db/course';
import ChapterForm from '@/components/LMS/chapter/ChapterForm';
import Error from '@/components/Error';
import BreadCrumb from '@/components/BreadCrumb';
import { getInstructors } from '@/db/instructor';

export const metadata = {
	title: 'Add New Chapter - LMS',
	description: 'Create a new chapter in the learning management system',
};

export default async function NewChapterPage({
	searchParams: { courseId },
}: {
	searchParams: { courseId?: string };
}) {
	const [courses, instructors] = await Promise.all([
		getCourses(),
		getInstructors(),
	]);

	if (courses.error || !courses.data) {
		return <Error message={courses.message || 'Error loading courses'} />;
	}

	if (instructors.error) {
		return (
			<Error message={instructors.message || 'Error loading instructors'} />
		);
	}

	const isCourseExist = courses.data.some((course) => course.id === courseId);

	return (
		<div className='mt-4'>
			<BreadCrumb
				items={[
					{ link: '/user/lms/chapters', text: 'Chapters' },
					{
						link: '/user/lms/chapters/new',
						text: 'Add Chapter',
						isCurrent: true,
					},
				]}
			/>

			<ChapterForm
				courses={courses.data || []}
				preSelectedCourseId={isCourseExist && courseId ? courseId : undefined}
				instructors={instructors.data || []}
			/>
		</div>
	);
}
