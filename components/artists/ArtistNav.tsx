import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';

export default function ArtistNav({ id }: { id: string }) {
	return (
		<div className='flex flex-col sm:flex-row justify-between gap-1.5'>
			<TabsList className='flex w-fit gap-2 sm:gap-4 bg-background text-white justify-start'>
				<TabsTrigger value='tracks' className='!p-0 rounded-full flex-shrink-0'>
					<Link
						href={`/artists/${id}`}
						className='px-2 py-1.5 sm:px-4 sm:py-1.5 rounded-full whitespace-nowrap text-sm sm:text-[15px]'
					>
						Artist Tracks
					</Link>
				</TabsTrigger>
				<TabsTrigger value='bio' className='!p-0 rounded-full flex-shrink-0'>
					<Link
						href={`/artists/${id}?sort=bio`}
						className='px-2 py-1.5 sm:px-4 sm:py-1.5 rounded-full whitespace-nowrap text-sm sm:text-[15px]'
					>
						Artist Bio
					</Link>
				</TabsTrigger>
			</TabsList>
		</div>
	);
}
