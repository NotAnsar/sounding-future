import { TabsContent } from '@/components/ui/tabs';
import { notFound } from 'next/navigation';
import TrackDetails from '@/components/tracks/track/TrackDetails';
import { Tabs } from '@/components/ui/tabs';
import { Icons } from '@/components/icons/track-icons';
import TrackList from '@/components/tracks/TrackList';
import { tracks } from '@/config/dummy-data';
import TrackNav from '@/components/tracks/track/TrackNav';
import Image from 'next/image';
import TrackArtist from '@/components/tracks/track/TrackArtist';
import TracksCarousel from '@/components/home/NewTracks';

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
			<Tabs value={tabValue} className='mt-4 sm:mt-8 flex flex-col sm:gap-3'>
				<TrackNav id={id} />

				<main className='mt-8'>
					<div className='grid grid-cols-1 xl:grid-cols-3 gap-4'>
						<div className='xl:col-span-2 '>
							<TabsContent value='info'>
								Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nemo
							</TabsContent>
							<TabsContent value='others'>
								<p className='font-semibold text-muted text-lg mb-4 px-2'>
									Other tracks from {track.artist.name}
								</p>
								<TrackList
									tracks={tracks.filter((t) => t.artist.id === track.artist.id)}
									className='lg:w-full p-0'
								/>
							</TabsContent>
							<TrackArtist track={track} />
						</div>
						<div>
							<ul className=' flex flex-col gap-3 lg:p-4 mt-2'>
								<li className='flex gap-3'>
									<Icons.tag className='w-6 h-auto aspect-auto fill-foreground' />{' '}
									{track.genre}
								</li>
								<li className='flex gap-3'>
									<Icons.calendar className='w-6 h-auto aspect-auto fill-foreground' />{' '}
									2018
								</li>
								<li className='flex gap-3'>
									<Icons.prize className='w-6 h-auto aspect-auto fill-foreground' />{' '}
									3D Audio competition
								</li>
								<li className='flex gap-3'>
									<Icons.datails className='w-6 h-auto aspect-auto fill-foreground' />{' '}
									3D AmbiX
								</li>
							</ul>
							<span className='w-fit flex flex-col gap-1 lg:p-4 mt-8 items-center'>
								<h4 className='text-sm'>Track curated by:</h4>
								<Image
									alt='Audio Match'
									src={'/collections/Audiomatch.png'}
									height={50}
									width={50}
									className='rounded-full'
								/>
								<p className='text-sm'>Audiomatch</p>
							</span>
						</div>
					</div>
					{/* <ArtistsCarousel
						className='mt-12'
						artists={artists}
						title='Artists you may also like'
						
					/> */}
					<TracksCarousel
						tracks={tracks}
						title='Tracks you may also like'
						classNameItem='basis-36 sm:basis-52 lg:basis-64'
						className='mt-12 '
						classNameTitle='text-[18px] sm:text-[22px]'
					/>
				</main>
			</Tabs>
		</>
	);
}
