import { reorderBanners } from '@/actions/banner-action';
import { columns } from '@/components/banners-crud/columns';
import { DataTable } from '@/components/banners-crud/data-table';
import Error from '@/components/Error';
import { buttonVariants } from '@/components/ui/button';
import { getBanners } from '@/db/banners';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default async function page() {
	const banners = await getBanners();

	if (banners.error) {
		return <Error message={banners.message} />;
	}

	return (
		<>
			<div className='flex flex-col sm:flex-row sm:items-center justify-between mt-4 mb-4 sm:mb-12 gap-2'>
				<h2 className='text-3xl md:text-5xl font-semibold'>Banners</h2>

				<Link href='/user/banners/new' className={cn(buttonVariants())}>
					<Plus className='w-4 h-auto aspect-square mr-2' /> Add Banner
				</Link>
			</div>
			{/* <DataTable columns={columns} data={banners.data} /> */}
			<DataTable
				columns={columns}
				data={banners.data}
				onReorder={reorderBanners}
			/>
		</>
	);
}
