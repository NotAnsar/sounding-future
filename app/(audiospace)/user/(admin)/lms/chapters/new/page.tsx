import { getCourses } from '@/db/course';
import ChapterForm from '@/components/LMS/chapter/ChapterForm';
import Error from '@/components/Error';
import BreadCrumb from '@/components/BreadCrumb';

export const metadata = {
	title: 'Add New Chapter - LMS',
	description: 'Create a new chapter in the learning management system',
};

export default async function NewChapterPage() {
	const courses = await getCourses();

	if (courses.error) {
		return <Error message={courses.message || 'Error loading courses'} />;
	}

	return (
		<div className='mt-4'>
			<BreadCrumb
				items={[
					{ link: '/user/lms', text: 'LMS' },
					{ link: '/user/lms/chapters', text: 'Chapters' },
					{
						link: '/user/lms/chapters/new',
						text: 'Add Chapter',
						isCurrent: true,
					},
				]}
			/>

			<ChapterForm courses={courses.data || []} />
		</div>
	);
}
