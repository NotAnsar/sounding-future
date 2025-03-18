import BreadCrumb from '@/components/BreadCrumb';
import Error from '@/components/Error';
import PricingCardForm from '@/components/sections/support-us/PricingCardForm';
import { getSubscriptionById } from '@/db/support-us';

export default async function Page({
	params: { id },
}: {
	params: { id: string };
}) {
	const data = await getSubscriptionById(id);

	if (data.error || !data.data) {
		return <Error message={data.message} />;
	}

	return (
		<div className='mt-4'>
			<BreadCrumb
				items={[
					{ link: '/user/sections/support-us', text: 'Support Us' },

					{
						link: '/user/banners/new',
						text: 'Edit Subscription Card',
						isCurrent: true,
					},
				]}
			/>

			<PricingCardForm initialData={data.data} />
		</div>
	);
}
