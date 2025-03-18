import BreadCrumb from '@/components/BreadCrumb';
import { EditSupportUsPage } from '@/components/sections/support-us/EditSupportUs';
import { PricingList } from '@/components/sections/support-us/PricingList';
import { Button } from '@/components/ui/button';
import {
	getSupportUsPageData,
	getSupportUsSubscriptions,
} from '@/db/support-us';
import { Edit } from 'lucide-react';

export default async function page() {
	const [{ data: subscriptionCard }, { data: supportUsData }] =
		await Promise.all([getSupportUsSubscriptions(), getSupportUsPageData()]);

	return (
		<div className='mt-4 '>
			<div className='flex flex-col sm:flex-row justify-between gap-2 mb-4'>
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

				<EditSupportUsPage data={supportUsData || undefined}>
					<Button className='cursor-pointer'>
						<Edit className='w-4 h-4 mr-2' />
						Edit Support Us Text
					</Button>
				</EditSupportUsPage>
			</div>
			<PricingList initialPlans={subscriptionCard} />
		</div>
	);
}
