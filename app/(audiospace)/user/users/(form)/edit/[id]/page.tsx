import BreadCrumb from '@/components/BreadCrumb';
import { getPartnerById } from '@/db/partner';
import CuratedForm from '@/components/CuratedCrud/form/CuratedForm';
import Error from '@/components/Error';

export default async function Page({
	params: { id },
}: {
	params: { id: string };
}) {
	const partner = await getPartnerById(id);

	if (partner.error) {
		return <Error message={partner.message} />;
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
			<CuratedForm initialData={partner.data || undefined} />
		</div>
	);
}
