import SettingsNav from '@/components/settings/SettingsNav';
import { ContactUsLink } from '@/components/termsAndLegal/ContactUsButton';
import { buttonVariants } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function Page() {
	return (
		<main>
			<Tabs value='membership' className='mt-4 sm:mt-8 grid sm:gap-3'>
				<SettingsNav />
				<TabsContent
					value='membership'
					className='mt-6 grid gap-6 max-w-screen-md'
				>
					<RadioGroup
						defaultValue='free'
						className='flex items-center space-x-4'
					>
						<div className='inline-flex items-center'>
							<RadioGroupItem
								value='free'
								id='free'
								className='text-white'
								disabled
							/>
							<Label htmlFor='free' className='ml-2 text-white'>
								Free
							</Label>
						</div>

						<div className='inline-flex items-center'>
							<RadioGroupItem
								value='pro'
								id='pro'
								className='text-white'
								disabled
							/>
							<Label htmlFor='pro' className='ml-2 text-white'>
								Pro
							</Label>
						</div>
					</RadioGroup>

					<div className='space-y-2  '>
						<p>
							Learn more how you can support us as Pro user and get advanced
							platform features.
						</p>
						<Link
							className={cn(buttonVariants(), 'font-semibold')}
							href={'https://buy.stripe.com/9AQ4id4eB05P8OkcMM'}
							target='_blank'
						>
							Support Us
						</Link>
					</div>
					<div className='space-y-2 text-[15px]'>
						<h3 className='font-semibold text-xl'>Manage your subscription:</h3>
						<p>
							To update your billing information, change your plan, or cancel
							your subscription, please visit our [Customer Portal].
						</p>

						<p>
							If you have any questions, please contact us using the{' '}
							<ContactUsLink className='no-underline hover:underline' /> form.
						</p>
					</div>
				</TabsContent>
			</Tabs>
		</main>
	);
}
