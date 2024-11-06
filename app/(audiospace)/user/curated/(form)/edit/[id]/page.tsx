import CuratedForm from '@/components/CuratedCrud/form/CuratedForm';
import BreadCrumb from '@/components/BreadCrumb';
import { collections } from '@/config/dummy-data';
import { notFound } from 'next/navigation';

export default function Page({ params: { id } }: { params: { id: string } }) {
	const collection = collections.find((c) => c.id === id);

	if (!collection) {
		notFound();
	}

	return (
		<div className='mt-4'>
			<BreadCrumb
				items={[
					{ link: '/user/curated', text: 'Curating Partner' },

					{
						link: '/user/curated/new',
						text: 'Edit Partner',
						isCurrent: true,
					},
				]}
			/>{' '}
			<CuratedForm initialData={collection} />
		</div>
	);
}
