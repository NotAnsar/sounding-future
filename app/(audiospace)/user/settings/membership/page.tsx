import SettingsNav from '@/components/settings/SettingsNav';
import { ContactUsLink } from '@/components/termsAndLegal/ContactUsButton';

import { Tabs, TabsContent } from '@/components/ui/tabs';

import Link from 'next/link';
import MembershipPlan from './MembershipPlan';
import { auth } from '@/lib/auth';

export default async function Page() {
	const session = await auth();

	return (
		<Tabs value='membership' className='mt-6 sm:mt-8'>
			<SettingsNav />
			<TabsContent
				value='membership'
				className='mt-8 space-y-8 max-w-screen-md'
			>
				<MembershipPlan isPro={session?.user.role === 'pro'} />
				<div>
					<h3 className='text-xl font-semibold mb-4'>Manage Subscription</h3>
					<div className='space-y-4'>
						<p>
							To update your billing information, change your plan, or cancel
							your subscription, please visit our{' '}
							<Link
								href='https://billing.stripe.com/p/login/bIYbLjcO1cna0wg144'
								target='_blank'
								className='underline text-primary-foreground cursor-pointer hover:text-primary-foreground/90'
							>
								Customer Portal
							</Link>
							.
						</p>

						<p>
							If you have any questions, please contact us using the{' '}
							<ContactUsLink /> form.
						</p>
					</div>
				</div>
			</TabsContent>
		</Tabs>
	);
}
