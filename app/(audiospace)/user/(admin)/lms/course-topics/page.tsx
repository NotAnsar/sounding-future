import { getTopics } from '@/db/topic';
import { DataTable } from '@/components/LMS/topic/data-table';
import { columns } from '@/components/LMS/topic/table/columns';
import { CreateTopicButton } from '@/components/LMS/topic/table/topic-dialog';
import Error from '@/components/Error';
import TagsNav from '@/components/tags/TagsNav';
import BreadCrumb from '@/components/BreadCrumb';

export const metadata = {
	title: 'Course Topics Management - LMS',
	description: 'Manage course topics for your learning management system',
};

export default async function CourseTopicsPage() {
	const topicsResult = await getTopics();

	if (topicsResult.error) {
		return (
			<Error message={topicsResult.message || 'Error loading course topics'} />
		);
	}

	return (
		<>
			<div className='flex flex-col sm:flex-row sm:items-center justify-between mt-4 sm:mb-12 gap-2'>
				<BreadCrumb
					items={[
						{ link: '/user/lms', text: 'Courses' },

						{
							link: '/user/lms/course-topics',
							text: 'Topics',
							isCurrent: true,
						},
					]}
				/>{' '}
				<CreateTopicButton />
			</div>

			<TagsNav currentPath='Topics' />
			<DataTable columns={columns} data={topicsResult.data} />
		</>
	);
}
