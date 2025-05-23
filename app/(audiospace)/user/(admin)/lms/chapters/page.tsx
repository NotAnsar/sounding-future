import { getChapters } from '@/db/chapter';
import { columns } from '@/components/LMS/chapter/table/columns';
import { DataTable } from '@/components/LMS/chapter/table/data-table';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import Error from '@/components/Error';
import BreadCrumb from '@/components/BreadCrumb';

export const metadata = {
	title: 'Chapters - LMS',
	description: 'Manage course chapters in the learning management system',
};

export default async function ChaptersPage() {
	const chapters = await getChapters();

	if (chapters.error) {
		return <Error message={chapters.message || 'Error loading chapters'} />;
	}

	return (
		<div className='mt-4'>
			<BreadCrumb
				items={[
					{ link: '/user/lms', text: 'Courses' },
					{ link: '/user/lms/chapters', text: 'Chapters', isCurrent: true },
				]}
			/>

			<div className='flex justify-between items-center mb-6'>
				<div>
					<h1 className='text-2xl font-bold'>Chapters</h1>
					<p className='text-muted-foreground'>Manage your course chapters</p>
				</div>
				<Button asChild>
					<Link href='/user/lms/chapters/new'>
						<Plus className='mr-2 h-4 w-4' />
						Add Chapter
					</Link>
				</Button>
			</div>

			<DataTable columns={columns} data={chapters.data || []} />
		</div>
	);
}
