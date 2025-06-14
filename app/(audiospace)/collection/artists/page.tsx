import ExploreArtists from '@/components/artists/ExploreArtists';
import Error from '@/components/Error';
import { Icons } from '@/components/icons/audio-player';
import ArtistList from '@/components/artists/ArtistList';
import { buttonVariants } from '@/components/ui/button';
import { getFollowingArtists } from '@/db/collections';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default async function page({
	searchParams: { type },
}: {
	searchParams: { type: string };
}) {
	const isTable = type === 'table';
	const { data, error, message } = await getFollowingArtists();

	if (error) {
		return <Error message={message} />;
	}

	return (
		<div>
			<div className='flex justify-between items-center mb-6'>
				<h1 className='text-4xl sm:text-5xl font-semibold'>Followed Artists</h1>
				<div className='flex gap-1 ml-auto sm:ml-0  '>
					<Link
						href={`?type=table`}
						className={cn(
							buttonVariants(),
							'bg-transparent p-1.5 sm:p-2 hover:bg-button group h-fit duration-200 transition-all shadow-none',
							isTable ? 'bg-button' : ''
						)}
					>
						<Icons.table
							className={cn(
								'w-5 sm:w-6 h-auto aspect-square text-foreground group-hover:text-white',
								isTable ? 'text-white' : ''
							)}
						/>
					</Link>
					<Link
						href={`?type=grid`}
						className={cn(
							buttonVariants(),
							'bg-transparent p-1.5 sm:p-2 hover:bg-button h-fit group shadow-none duration-200 transition-all',
							!isTable ? 'bg-button' : ''
						)}
					>
						<Icons.grid
							className={cn(
								'w-5 sm:w-6 h-auto aspect-square text-foreground group-hover:text-white shadow-none',
								!isTable ? 'text-white' : ''
							)}
						/>
					</Link>
				</div>
			</div>

			{data.length === 0 ? (
				<div className='flex flex-col items-center justify-center h-96'>
					<h2 className='text-2xl font-semibold'>No Followed Artists Found</h2>
					<p className='text-muted text-center max-w-md'>
						{
							"You haven't followed any artists yet. Explore our artists and start following them!"
						}{' '}
						<Link
							href={'/artists'}
							className='text-primary hover:underline font-medium'
						>
							Browse Artists
						</Link>
					</p>
				</div>
			) : (
				<div className='xl:w-2/3'>
					{isTable ? (
						<ArtistList artists={data} followedArtists={data} />
					) : (
						<ExploreArtists artists={data} />
					)}
				</div>
			)}
		</div>
	);
}
