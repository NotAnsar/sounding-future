import BreadCrumb from '@/components/BreadCrumb';
import { EditAboutHeader } from '@/components/sections/about/IntroductionSection';
import { Button, buttonVariants } from '@/components/ui/button';
import { getAboutHeader } from '@/db/about';
import { cn } from '@/lib/utils';
import { ChevronRight, Edit, Users } from 'lucide-react';
import Link from 'next/link';

export default async function page() {
	const { data } = await getAboutHeader();
	return (
		<div className='mt-4'>
			<div className='flex flex-col sm:flex-row justify-between gap-2'>
				<div>
					<BreadCrumb
						items={[
							{ link: '/user/sections', text: 'Edit Sections' },

							{
								link: '/user/sections/About',
								text: 'About Page',
								isCurrent: true,
							},
						]}
					/>
					<p className='text-muted mt-2'>Manage your about page</p>
				</div>

				<Link href='/user/sections/faq' className={cn(buttonVariants())}>
					<Edit className='w-4 h-4 mr-2' />
					Edit FAQ
				</Link>
			</div>
			<div className='mt-6 space-y-4'>
				<div className='grid md:grid-cols-2 gap-4 '>
					<Button
						variant={'outline'}
						className={cn(
							'group hover:border-primary hover:bg-primary/5 transition-all duration-200 p-6 h-20'
						)}
					>
						<div className='flex items-center gap-3 w-full '>
							<Users className='w-5 h-5' />
							<span className='font-medium'>Producers Section</span>
							<ChevronRight className='w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity' />
						</div>
					</Button>
					<Button
						variant={'outline'}
						className={cn(
							'group hover:border-primary hover:bg-primary/5 transition-all duration-200 p-6 h-20'
						)}
					>
						<div className='flex items-center gap-3 w-full'>
							<Users className='w-5 h-5' />
							<span className='font-medium'>Consumers Section</span>
							<ChevronRight className='w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity' />
						</div>
					</Button>
				</div>
				<EditAboutHeader data={data || undefined} />
			</div>
		</div>
	);
}
