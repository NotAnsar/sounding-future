import BreadCrumb from '@/components/BreadCrumb';
import { notFound } from 'next/navigation';
import { getPartnerById } from '@/db/partner';
import CuratedForm from '@/components/CuratedCrud/form/CuratedForm';

export default async function Page({
	params: { id },
}: {
	params: { id: string };
}) {
	const partner = await getPartnerById(id);

	if (!partner) {
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
			<CuratedForm initialData={partner} />
		</div>
	);
}
