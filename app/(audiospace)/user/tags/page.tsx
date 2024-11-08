import BreadCrumb from '@/components/BreadCrumb';
import { columns } from '@/components/tags/GenreForm/table/columns';
import { DataTable } from '@/components/tags/GenreForm/table/data-table';
import { CreateGenreButton } from '@/components/tags/GenreForm/table/genre-dialog';
import TagsNav from '@/components/tags/TagsNav';
import { genreTags } from '@/config/tags';
import { auth } from '@/lib/auth';
import { notFound } from 'next/navigation';

export default async function page() {
	const session = await auth();

	if (!session || session.user.role !== 'admin') {
		notFound();
	}

	return (
		<>
			<div className='flex flex-col sm:flex-row sm:items-center justify-between mt-4 sm:mb-12 gap-2'>
				<BreadCrumb
					items={[
						{ link: '/user/tags', text: 'Tags' },

						{
							link: '/user/tags',
							text: 'Genre',
							isCurrent: true,
						},
					]}
				/>{' '}
				<CreateGenreButton />
			</div>
			<TagsNav />
			<DataTable columns={columns} data={genreTags} />
		</>
	);
}
