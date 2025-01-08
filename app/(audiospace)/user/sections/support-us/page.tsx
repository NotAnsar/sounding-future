import BreadCrumb from '@/components/BreadCrumb';
import { EditSubscriptionButton } from '@/components/sections/BecameSupporterDialog';
import { SubscriptionForm } from '@/components/sections/SubscriptionCard';

import { Button } from '@/components/ui/button';
import { getSubscriptionCard } from '@/db/pages';
import { getSubscription } from '@/db/section';
import { Edit } from 'lucide-react';

export default async function page() {
	const [{ data: subscription }, { data: subscriptionCard }] =
		await Promise.all([getSubscription(), getSubscriptionCard()]);

	return (
		<div className='mt-4 '>
			<div className='flex flex-col sm:flex-row justify-between gap-2'>
				<div>
					<BreadCrumb
						items={[
							{ link: '/user/sections', text: 'Edit Sections' },

							{
								link: '/user/sections/support-us',
								text: 'Support Us',
								isCurrent: true,
							},
						]}
					/>
					<p className='text-muted mt-2'>Manage your support us page</p>
				</div>

				<EditSubscriptionButton data={subscription || undefined}>
					<Button className='cursor-pointer'>
						<Edit className='w-4 h-4 mr-2' />
						Edit Become a Supporter
					</Button>
				</EditSubscriptionButton>
			</div>
			<SubscriptionForm initialData={subscriptionCard || undefined} />
		</div>
	);
}
