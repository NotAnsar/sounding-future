import BreadCrumb from '@/components/BreadCrumb';
import { columns } from '@/components/tags/SourceForm/table/columns';
import { DataTable } from '@/components/tags/SourceForm/table/data-table';
import { sourceFormatData } from '@/config/tags';
import TagsNav from '@/components/tags/TagsNav';
import { auth } from '@/lib/auth';
import { notFound } from 'next/navigation';
import { CreateFormatButton } from '@/components/tags/SourceForm/table/format-dialog';

export default async function page() {
	const session = await auth();

	if (!session || session.user.role !== 'admin') {
		notFound();
	}

	return (
		<>
			<div className='flex items-center justify-between mt-4 mb-12'>
				<BreadCrumb
					items={[
						{ link: '/user/tags', text: 'Tags' },

						{
							link: '/user/tags/format',
							text: 'Source Format',
							isCurrent: true,
						},
					]}
				/>{' '}
				<CreateFormatButton />
			</div>
			<TagsNav isFormatPage />

			<DataTable columns={columns} data={sourceFormatData} />
		</>
	);
}
