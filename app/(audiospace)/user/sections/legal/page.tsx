'use client';
import BreadCrumb from '@/components/BreadCrumb';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import React from 'react';

export default function page() {
	return (
		<div className='mt-4'>
			<div className='flex flex-col sm:flex-row justify-between gap-2'>
				<div>
					<BreadCrumb
						items={[
							{ link: '/user/sections', text: 'Edit Sections' },

							{
								link: '/user/sections/legal',
								text: 'Legal Page',
								isCurrent: true,
							},
						]}
					/>
					<p className='text-muted mt-2'>Manage your legal page</p>
				</div>

				<Button>
					<Plus className='w-4 h-4 mr-2' />
					Add Section
				</Button>
			</div>
		</div>
	);
}
