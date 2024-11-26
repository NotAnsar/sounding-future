import ArtistError from '@/components/ArtistError';
import { columns } from '@/components/TracksCrud/table/columns';
import { DataTable } from '@/components/TracksCrud/table/data-table';
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

	if (tracks.artistError) {
		return <ArtistError />;
	}

	return (
		<>
			<div className='flex items-center justify-between mt-4 mb-12'>
				<h2 className='text-3xl md:text-5xl font-semibold'>Tracks</h2>

				<Link href={'/user/tracks/upload'} className={cn(buttonVariants())}>
					<Upload className='w-4 h-auto aspect-square mr-2' /> Upload Track
				</Link>
			</div>
			<DataTable columns={columns} data={tracks.data} />
		</>
	);
}
