import BreadCrumb from '@/components/BreadCrumb';
import { columns } from '@/components/tags/SourceForm/table/columns';
import { DataTable } from '@/components/tags/SourceForm/table/data-table';
import TagsNav from '@/components/tags/TagsNav';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { CreateFormatButton } from '@/components/tags/SourceForm/table/format-dialog';
import { getSourceFormats } from '@/db/source-format';
import Error from '@/components/Error';
import { reorderFormat } from '@/actions/format-action';

export default async function page() {
	const [session, sourceFormats] = await Promise.all([
		auth(),
		getSourceFormats(),
	]);

	if (!session || session.user.role !== 'admin') {
		redirect('/');
	}

	if (sourceFormats.error) {
		return <Error message={sourceFormats.message} />;
	}

	return (
		<>
			<div className='flex flex-col sm:flex-row sm:items-center justify-between mt-4 sm:mb-12 gap-2'>
				<BreadCrumb
					items={[
						{ link: '/user/tags', text: 'Tags' },

						{
							link: '/user/tags/format',
							text: 'Source Format',
							isCurrent: true,
						},
					]}
				/>
				<CreateFormatButton />
			</div>
			<TagsNav currentPath='Format' />

			<DataTable
				columns={columns}
				data={sourceFormats.data}
				onReorder={reorderFormat}
				key={sourceFormats.data.length}
			/>
		</>
	);
}
