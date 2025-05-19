import { reorderHelpCenterVideos } from '@/actions/helpcenter-action';
import BreadCrumb from '@/components/BreadCrumb';
import { columns } from '@/components/helpcenter-crud/columns';
import { DataTable } from '@/components/helpcenter-crud/data-table';
import { buttonVariants } from '@/components/ui/button';
import { getHelpCenter } from '@/db/help-center';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';

import React from 'react';

export default async function page() {
	const { data } = await getHelpCenter();

	return (
		<div className='mt-4'>
			<div className='flex flex-col sm:flex-row justify-between gap-2'>
				<div>
					<BreadCrumb
						items={[
							{
								link: '/user/sections/help-center',
								text: 'Help Center',
								isCurrent: true,
							},
						]}
					/>
					<p className='text-muted mt-2'>Manage your help center videos</p>
				</div>
				<Link
					href={'/user/sections/help-center/new'}
					className={cn(buttonVariants())}
				>
					<Plus className='w-4 h-auto aspect-square mr-2' /> Add Video
				</Link>
			</div>
			<DataTable
				columns={columns}
				data={data}
				onReorder={reorderHelpCenterVideos}
				key={data.length}
			/>
		</div>
	);
}
