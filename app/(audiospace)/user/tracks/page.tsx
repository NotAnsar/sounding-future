import { columns } from '@/components/TracksForm/table/columns';
import { DataTable } from '@/components/TracksForm/table/data-table';
import { buttonVariants } from '@/components/ui/button';
import { tracks } from '@/config/dummy-data';
import { auth } from '@/lib/auth';
import { cn } from '@/lib/utils';
import { Upload } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function page() {
	const session = await auth();

	if (!session) {
		notFound();
	}

	return (
		<>
			<div className='flex items-center justify-between mt-4 mb-12'>
				<h2 className='text-3xl md:text-5xl font-semibold'>My Tracks</h2>

				<Link href={'/user/upload-track'} className={cn(buttonVariants())}>
					<Upload className='w-4 h-auto aspect-square mr-2' /> Upload Track
				</Link>
			</div>
			<DataTable columns={columns} data={tracks} />
		</>
	);
}
