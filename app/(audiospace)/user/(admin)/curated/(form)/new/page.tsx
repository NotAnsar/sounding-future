import BreadCrumb from '@/components/BreadCrumb';
import CuratedForm from '@/components/CuratedCrud/form/CuratedForm';

export default function Page() {
	return (
		<div className='mt-4'>
			<BreadCrumb
				items={[
					{ link: '/user/curated', text: 'Curating Partner' },

					{
						link: '/user/curated/new',
						text: 'Add Partner',
						isCurrent: true,
					},
				]}
			/>
			<CuratedForm />
		</div>
	);
}
