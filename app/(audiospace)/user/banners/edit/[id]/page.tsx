import BannerForm from '@/components/banners-crud/banner-form';
import BreadCrumb from '@/components/BreadCrumb';
import Error from '@/components/Error';
import { getBannerByid } from '@/db/banners';

export default async function Page({
	params: { id },
}: {
	params: { id: string };
}) {
	const banner = await getBannerByid(id);

	if (banner.error || !banner.data) {
		return <Error message={banner.message} />;
	}

	return (
		<div className='mt-4'>
			<BreadCrumb
				items={[
					{ link: '/user/banners', text: 'Banner' },
					{
						link: '/user/banners/new',
						text: 'Edit Banner',
						isCurrent: true,
					},
				]}
			/>
			<BannerForm initialData={banner.data} />
		</div>
	);
}
