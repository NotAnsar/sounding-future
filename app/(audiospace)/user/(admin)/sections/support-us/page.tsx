import BreadCrumb from '@/components/BreadCrumb';
import { EditSupportUsPage } from '@/components/sections/support-us/EditSupportUs';
import { PricingList } from '@/components/sections/support-us/PricingList';
import { Button, buttonVariants } from '@/components/ui/button';
import {
	getSupportUsPageData,
	getSupportUsSubscriptions,
} from '@/db/support-us';
import { cn } from '@/lib/utils';
import { Edit, Plus } from 'lucide-react';
import Link from 'next/link';

export default async function page() {
	const [{ data: subscriptionCard }, { data: supportUsData }] =
		await Promise.all([getSupportUsSubscriptions(), getSupportUsPageData()]);

	return (
		<div className='mt-4'>
			<div className='mb-6'>
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

			<div className='flex flex-wrap gap-3 mb-6'>
				<EditSupportUsPage data={supportUsData || undefined}>
					<Button className='cursor-pointer'>
						<Edit className='w-4 h-4 mr-2' />
						Edit Support Us Text
					</Button>
				</EditSupportUsPage>

				<Link
					href='/user/sections/pricing/new'
					className={cn(buttonVariants())}
				>
					<Plus className='w-4 h-4 mr-2' />
					Add new subscription card
				</Link>
			</div>
			<PricingList initialPlans={subscriptionCard} />
		</div>
	);
}
