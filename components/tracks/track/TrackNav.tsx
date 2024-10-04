import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';

export default function TrackNav({ id }: { id: string }) {
	return (
		<div className='flex flex-col sm:flex-row justify-between gap-1.5'>
			<TabsList className='flex w-fit gap-2 sm:gap-4 bg-background text-white justify-start'>
				<TabsTrigger value='info' className='!p-0'>
					<Link
						href={`/tracks/${id}`}
						className='px-2 py-1.5 sm:px-3 sm:py-1.5'
					>
						Track Info
					</Link>
				</TabsTrigger>
				<TabsTrigger value='artist' className='!p-0'>
					<Link
						href={`/tracks/${id}?sort=artist`}
						className='px-2 py-1.5 sm:px-3 sm:py-1.5'
					>
						Artist Bio
					</Link>
				</TabsTrigger>
				<TabsTrigger value='others' className='!p-0'>
					<Link
						href={`/tracks/${id}?sort=others`}
						className='px-2 py-1.5 sm:px-3 sm:py-1.5'
					>
						Other Tracks
					</Link>
				</TabsTrigger>
			</TabsList>
		</div>
	);
}
