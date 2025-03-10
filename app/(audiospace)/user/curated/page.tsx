import { reorderPartner } from '@/actions/curated';
import { columns } from '@/components/CuratedCrud/table/columns';
import { DataTable } from '@/components/CuratedCrud/table/data-table';
import Error from '@/components/Error';
import { buttonVariants } from '@/components/ui/button';
import { getPartnersStats } from '@/db/partner';
import { auth } from '@/lib/auth';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function page() {
	const [session, data] = await Promise.all([auth(), getPartnersStats()]);

	if (!session || session.user.role !== 'admin') {
		notFound();
	}

	if (data.error) {
		return <Error message={data.message} />;
	}

	return (
		<>
			<div className='flex flex-col sm:flex-row sm:items-center justify-between mt-4 mb-4 sm:mb-12 gap-2'>
				<div>
					<h2 className='text-3xl md:text-5xl font-semibold'>
						Curating Partners
					</h2>
					<p className='text-muted-foreground mt-1 font-medium text-[15px]'>
						Total partners: {data.data.length}
					</p>
				</div>

				<Link href={'/user/curated/new'} className={cn(buttonVariants())}>
					<Plus className='w-4 h-auto aspect-square mr-2' /> Add Partner
				</Link>
			</div>

			<DataTable
				columns={columns}
				data={data.data}
				onReorder={reorderPartner}
				key={data.data.length}
			/>
		</>
	);
}
