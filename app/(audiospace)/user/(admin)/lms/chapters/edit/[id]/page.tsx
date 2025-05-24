import { getChapterById } from '@/db/chapter';
import { getCourses } from '@/db/course';
import ChapterForm from '@/components/LMS/chapter/ChapterForm';
import Error from '@/components/Error';
import { notFound } from 'next/navigation';
import BreadCrumb from '@/components/BreadCrumb';
import { getInstructors } from '@/db/instructor';

export const metadata = {
	title: 'Edit Chapter - LMS',
	description: 'Edit an existing chapter in the learning management system',
};

export default async function EditChapterPage({
	params,
}: {
	params: { id: string };
}) {
	const { id } = params;

	const [chapter, courses, instructors] = await Promise.all([
		getChapterById(id),
		getCourses(),
		getInstructors(),
	]);

	if (chapter.error || !chapter.data) {
		return notFound();
	}

	if (courses.error) {
		return <Error message={courses.message || 'Error loading courses'} />;
	}

	return (
		<div className='mt-4'>
			<BreadCrumb
				items={[
					{ link: '/user/lms/chapters', text: 'Chapters' },
					{
						link: `/user/lms/chapters/edit/${id}`,
						text: 'Edit Chapter',
						isCurrent: true,
					},
				]}
			/>

			<ChapterForm
				initialData={chapter.data}
				courses={courses.data || []}
				instructors={instructors.data || []}
			/>
		</div>
	);
}
