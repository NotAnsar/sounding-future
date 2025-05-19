import { columns } from '@/components/artists-crud/table/columns';
import { DataTable } from '@/components/artists-crud/table/data-table';
import Error from '@/components/Error';
import { buttonVariants } from '@/components/ui/button';
import { getArtistsStats } from '@/db/artist';
import { auth } from '@/lib/auth';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function page() {
	const [session, artists] = await Promise.all([auth(), getArtistsStats()]);

	if (!session) notFound();

	if (artists.error) {
		return <Error message={artists.message} />;
	}

	return (
		<>
			<div className='flex flex-col sm:flex-row sm:items-center justify-between mt-4 mb-4 sm:mb-12 gap-2'>
				<div>
					<h2 className='text-3xl md:text-5xl font-semibold'>Artists</h2>
					<p className='text-muted-foreground mt-1 font-medium text-[15px]'>
						Total artists: {artists.data.length}
					</p>
				</div>

				<Link href={'/user/artists/new'} className={cn(buttonVariants())}>
					<Plus className='w-4 h-auto aspect-square mr-2' /> Add Artist
				</Link>
			</div>
			<DataTable columns={columns} data={artists.data} />
		</>
	);
}
