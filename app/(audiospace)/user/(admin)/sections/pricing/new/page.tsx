import BreadCrumb from '@/components/BreadCrumb';
import PricingCardForm from '@/components/sections/support-us/PricingCardForm';

export default async function Page() {
	return (
		<div className='mt-4'>
			<BreadCrumb
				items={[
					{ link: '/user/sections/support-us', text: 'Support Us' },

					{
						link: '/user/banners/new',
						text: 'Add Subscription Card',
						isCurrent: true,
					},
				]}
			/>
			<PricingCardForm />
		</div>
	);
}
