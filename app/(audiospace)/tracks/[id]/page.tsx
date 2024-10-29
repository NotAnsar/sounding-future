import { TabsContent } from '@/components/ui/tabs';
import { notFound } from 'next/navigation';
import TrackDetails from '@/components/tracks/track/TrackDetails';
import { Tabs } from '@/components/ui/tabs';
import { Icons } from '@/components/icons/track-icons';
import TrackList from '@/components/tracks/TrackList';
import { tracks } from '@/config/dummy-data';
import TrackNav from '@/components/tracks/track/TrackNav';
import TrackArtist from '@/components/tracks/track/TrackArtist';
import TracksCarousel from '@/components/home/NewTracks';
import CollapsibleText from '@/components/CollapsibleText';

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
								<CollapsibleText
									text='	Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta
								architecto illo optio, sed, ratione unde voluptate fuga ullam
								qui obcaecati nostrum enim? Enim provident ut eum praesentium
								aliquid deleniti. Mollitia delectus vitae dolorem dicta
								laboriosam tenetur at, corporis accusantium facere, ducimus eum.
								Quidem sunt reiciendis magni distinctio nihil nemo et
								consectetur in corrupti blanditiis vitae, fugiat, iure molestias
								suscipit accusantium Lorem ipsum dolor sit amet consectetur
								adipisicing elit. Deleniti soluta labore voluptates quidem
								ducimus maxime dolore expedita doloremque autem nihil? Nobis sed
								consequuntur at architecto.	Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta
								architecto illo optio, sed, ratione unde voluptate fuga ullam
								qui obcaecati nostrum enim? Enim provident ut eum praesentium
								aliquid deleniti. Mollitia delectus vitae dolorem dicta
								laboriosam tenetur at, corporis accusantium facere, ducimus eum.
								Quidem sunt reiciendis magni distinctio nihil nemo et
								consectetur in corrupti blanditiis vitae, fugiat, iure molestias
								suscipit accusantium Lorem ipsum dolor sit amet consectetur
								adipisicing elit. Deleniti soluta labore voluptates quidem
								ducimus maxime dolore expedita doloremque autem nihil? Nobis sed
								consequuntur at architecto.'
									className='max-w-2xl'
								/>
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
							{/* <ul className=' flex flex-col gap-3 lg:p-4 mt-2  '> */}
							<ul className='mt-2 px-10 py-6 bg-player rounded-2xl text-center justify-center space-y-3'>
								<li className='flex gap-3 '>
									<Icons.tag className='w-5 h-auto aspect-auto fill-foreground' />{' '}
									{track.genre.name}
								</li>
								<li className='flex gap-3'>
									<Icons.calendar className='w-5 h-auto aspect-auto fill-foreground' />{' '}
									2018
								</li>
								<li className='flex gap-3'>
									<Icons.prize className='w-5 h-auto aspect-auto fill-foreground' />{' '}
									3D Audio competition
								</li>
								<li className='flex gap-3'>
									<Icons.datails className='w-5 h-auto aspect-auto fill-foreground' />{' '}
									3D AmbiX
								</li>
								<li className='w-fit flex flex-col gap-1 text-left'>
									<h4>Track curated by:</h4>
									<p>{track.collection.name}</p>
								</li>
							</ul>
						</div>
					</div>

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
