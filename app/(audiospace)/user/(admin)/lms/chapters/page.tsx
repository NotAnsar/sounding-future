import BreadCrumb from '@/components/BreadCrumb';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default async function page() {
	return (
		<div className='mt-4'>
			<div className='flex flex-col sm:flex-row justify-between gap-2'>
				<div>
					<BreadCrumb
						items={[
							{ link: '/user/lms', text: 'Courses' },

							{
								link: '/user/lms/chapters',
								text: 'Chapters',
								isCurrent: true,
							},
						]}
					/>
				</div>

				<Link href={'/user/lms/chapters/new'} className={cn(buttonVariants())}>
					<Plus className='w-4 h-auto aspect-square mr-2' /> Add Chapter
				</Link>
			</div>
		</div>
	);
}
