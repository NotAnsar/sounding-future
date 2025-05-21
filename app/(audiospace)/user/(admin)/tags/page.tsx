import { reorderGenre } from '@/actions/genre-action';
import BreadCrumb from '@/components/BreadCrumb';
import Error from '@/components/Error';
import { columns } from '@/components/tags/GenreForm/table/columns';
import { DataTable } from '@/components/tags/GenreForm/table/data-table';
import { CreateGenreButton } from '@/components/tags/GenreForm/table/genre-dialog';
import TagsNav from '@/components/tags/TagsNav';
import { getGenres } from '@/db/genre';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function page() {
	const [session, genres] = await Promise.all([auth(), getGenres()]);

	if (!session || session.user.role !== 'admin') {
		redirect('/');
	}

	if (genres.error) {
		return <Error message={genres.message} />;
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
			<TagsNav currentPath='Genre' />
			<DataTable
				columns={columns}
				data={genres.data}
				onReorder={reorderGenre}
				key={genres.data.length}
			/>
		</>
	);
}
