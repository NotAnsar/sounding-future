import BannerForm from '@/components/banners-crud/banner-form';
import BreadCrumb from '@/components/BreadCrumb';

export default function Page() {
	return (
		<div className='mt-4'>
			<BreadCrumb
				items={[
					{ link: '/user/banners', text: 'Banners' },

					{
						link: '/user/banners/new',
						text: 'Add Banner',
						isCurrent: true,
					},
				]}
			/>
			<BannerForm />
		</div>
	);
}
