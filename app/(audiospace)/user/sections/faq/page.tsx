import BreadCrumb from '@/components/BreadCrumb';
import { FaqDialog } from '@/components/sections/faq/FaqDialog';
import { FAQList } from '@/components/sections/faq/FAQList';
import { Button } from '@/components/ui/button';
import { getFaqs } from '@/db/section';
import { Plus } from 'lucide-react';
import React from 'react';

export default async function page() {
	const { data: faqs } = await getFaqs();

	return (
		<div className='mt-4'>
			<div className='flex flex-col sm:flex-row justify-between gap-2'>
				<div>
					<BreadCrumb
						items={[
							{ link: '/user/sections', text: 'Edit Sections' },

							{
								link: '/user/sections/faq',
								text: 'Faq',
								isCurrent: true,
							},
						]}
					/>
					<p className='text-muted mt-2'>
						Manage your frequently asked questions
					</p>
				</div>
				<FaqDialog>
					<Button>
						<Plus className='w-4 h-4 mr-2' />
						Add Question
					</Button>
				</FaqDialog>
			</div>

			<FAQList initialFaqs={faqs} key={faqs.length} />
		</div>
	);
}
