import { TabsContent } from '@/components/ui/tabs';
import { notFound } from 'next/navigation';
import TrackDetails from '@/components/tracks/track/TrackDetails';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import ArtistsCarousel from '@/components/home/ArtistCarousel';
import { Icons } from '@/components/icons/track-icons';
import TrackList from '@/components/tracks/TrackList';
import { artists, tracks } from '@/config/dummy-data';

export default function page({
	params: { id },
	searchParams: { sort },
}: {
	params: { id: string };
	searchParams: { sort: string };
}) {
	const track = tracks.find((a) => {
		return a.id === id;
	});

	const tabValue = sort === 'artist' || sort === 'others' ? sort : 'info';

	if (!track) {
		notFound();
	}

	return (
		<>
			<TrackDetails track={track} />
			<Tabs value={tabValue} className='mt-4 sm:mt-8 grid sm:gap-3'>
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

				<main className='mt-8'>
					<div className='grid xl:grid-cols-3 gap-4'>
						<div className='col-span-2'>
							<TabsContent value='info'>
								Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nemo
							</TabsContent>
							<TabsContent value='others'>
								<TrackList
									tracks={tracks.slice(0, 3)}
									className='lg:w-full p-0'
								/>
							</TabsContent>
							<TabsContent value='artist'>
								<p>artist page {id}</p>
							</TabsContent>
						</div>
						<ul className='xl:p-4 flex flex-col gap-3 lg:p-4 mt-2'>
							<li className='flex gap-3'>
								<Icons.tag className='w-6 h-auto aspect-auto fill-white' />{' '}
								{track.genre}
							</li>
							<li className='flex gap-3'>
								<Icons.calendar className='w-6 h-auto aspect-auto fill-white' />{' '}
								2018
							</li>
							<li className='flex gap-3'>
								<Icons.prize className='w-6 h-auto aspect-auto fill-white' /> 3D
								Audio competition
							</li>
							<li className='flex gap-3'>
								<Icons.datails className='w-6 h-auto aspect-auto fill-white' />{' '}
								3D AmbiX
							</li>
						</ul>
					</div>
					<ArtistsCarousel
						className='mt-12 '
						artists={artists}
						title='Similar artists'
						classNameItem='basis-32 sm:basis-52 lg:basis-64'
					/>
				</main>
			</Tabs>
		</>
	);
}
