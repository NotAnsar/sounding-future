import Error from '@/components/Error';
import { Icons } from '@/components/icons/audio-player';
import { buttonVariants } from '@/components/ui/button';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { getUserFavoriteCoursesWithDetails } from '@/db/course';
import CoursesCard, { CoursesListCard } from '@/components/courses/CoursesCard';

export default async function page({
	searchParams: { type },
}: {
	searchParams: { type: string };
}) {
	const isTable = type === 'table';
	const { data, error, message } = await getUserFavoriteCoursesWithDetails();

	if (error || !data) {
		return <Error message={message} />;
	}

	return (
		<div>
			<div className='flex justify-between items-center mb-6'>
				<h1 className='text-4xl sm:text-5xl font-semibold'>Liked Courses</h1>
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
					<h2 className='text-2xl font-semibold'>No liked courses found</h2>
					<p className='text-muted'>
						{"You haven't liked any courses yet. Explore our "}
						<Link
							href='/courses'
							className='text-primary hover:underline font-medium'
						>
							courses
						</Link>{' '}
						and start liking them!
					</p>
				</div>
			) : (
				<div>
					{isTable ? (
						<div className='grid grid-cols-1 gap-4'>
							{data.map((c) => (
								<CoursesListCard course={c} key={c.id} />
							))}
						</div>
					) : (
						<div
							className={
								'grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 sm:gap-x-6 sm:gap-y-10 2xl:gap-x-10 '
							}
						>
							{data.map((c) => (
								<CoursesCard course={c} key={c.id} />
							))}
						</div>
					)}
				</div>
			)}
		</div>
	);
}
