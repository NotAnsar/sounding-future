import BreadCrumb from '@/components/BreadCrumb';
import Error from '@/components/Error';
import { columns } from '@/components/LMS/instructor/table/columns';
import { DataTable } from '@/components/LMS/instructor/table/data-table';

import { buttonVariants } from '@/components/ui/button';
import { getInstructors } from '@/db/instructor';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default async function page() {
	const instructors = await getInstructors();

	if (instructors.error) {
		return <Error message={instructors?.message} />;
	}

	return (
		<>
			<div className='flex flex-col sm:flex-row justify-between gap-2 mb-4 sm:mb-12 mt-4'>
				<div>
					<BreadCrumb
						items={[
							{ link: '/user/lms', text: 'Courses' },

							{
								link: '/user/lms/intructors',
								text: 'Instructors',
								isCurrent: true,
							},
						]}
					/>
				</div>

				<Link
					href={'/user/lms/intructors/new'}
					className={cn(buttonVariants())}
				>
					<Plus className='w-4 h-auto aspect-square mr-2' /> Add Instructor
				</Link>
			</div>
			<DataTable columns={columns} data={instructors.data} />
		</>
	);
}
