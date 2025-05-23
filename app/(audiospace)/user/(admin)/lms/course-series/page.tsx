import { getSeries } from '@/db/serie';
import { columns } from '@/components/LMS/serie/table/columns';
import { CreateSeriesButton } from '@/components/LMS/serie/table/series-dialog';
import Error from '@/components/Error';
import TagsNav from '@/components/tags/TagsNav';
import BreadCrumb from '@/components/BreadCrumb';
import { DataTable } from '@/components/LMS/serie/data-table';

export const metadata = {
	title: 'Course Series Management - LMS',
	description: 'Manage course series for your learning management system',
};

export default async function CourseSeriesPage() {
	const seriesResult = await getSeries();

	if (seriesResult.error) {
		return (
			<Error message={seriesResult.message || 'Error loading course series'} />
		);
	}

	return (
		<>
			<div className='flex flex-col sm:flex-row sm:items-center justify-between mt-4 sm:mb-12 gap-2'>
				<BreadCrumb
					items={[
						{ link: '/user/lms', text: 'Courses' },

						{
							link: '/user/lms/course-series',
							text: 'Topics',
							isCurrent: true,
						},
					]}
				/>{' '}
				<CreateSeriesButton />
			</div>

			<TagsNav currentPath='Series' />
			<DataTable columns={columns} data={seriesResult.data} />
		</>
	);
}
