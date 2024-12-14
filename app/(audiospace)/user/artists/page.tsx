import { columns } from '@/components/artists-crud/table/columns';
import { DataTable } from '@/components/artists-crud/table/data-table';
import Error from '@/components/Error';
import { buttonVariants } from '@/components/ui/button';
import { getTracksStats } from '@/db/tracks';
import { auth } from '@/lib/auth';
import { cn } from '@/lib/utils';
import { Upload } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function page() {
	const [session, tracks] = await Promise.all([auth(), getTracksStats()]);

	if (!session) notFound();

	if (tracks.error) {
		return <Error message={tracks.message} />;
	}

	return (
		<>
			<div className='flex items-center justify-between mt-4 mb-12'>
				<h2 className='text-3xl md:text-5xl font-semibold'>Artists</h2>

				<Link href={'/user/tracks/upload'} className={cn(buttonVariants())}>
					<Upload className='w-4 h-auto aspect-square mr-2' /> Add Artist
				</Link>
			</div>
			<DataTable columns={columns} data={tracks.data} />
		</>
	);
}
