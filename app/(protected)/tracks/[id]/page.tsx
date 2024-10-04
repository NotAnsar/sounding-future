import { TabsContent } from '@/components/ui/tabs';
import { notFound } from 'next/navigation';
import { artists, tracks } from '@/config/dummy-data';
import TrackDetails from '@/components/tracks/track/TrackDetails';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import ArtistsCarousel from '@/components/home/ArtistCarousel';
import { Icons } from '@/components/icons/track-icons';
import TrackList from '@/components/tracks/TrackList';

export default function page({
	params: { id },
	searchParams: { sort },
}: {
	params: { id: string };
	searchParams: { sort: string };
}) {
	const track = tracks.find((a) => a.id === id);
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
								voluptate possimus aut qui eius, earum expedita necessitatibus
								veniam, reprehenderit est dicta alias ex eos deleniti excepturi
								sequi magnam sapiente consequatur. Quod doloremque iste ullam
								quaerat asperiores laudantium eveniet, corrupti, distinctio
								nulla architecto cupiditate aspernatur voluptates quisquam
								explicabo in sunt quam aliquam expedita ex sit ducimus. Quam
								similique pariatur illo natus itaque hic, quaerat, nihil ab
								quas, incidunt porro obcaecati officia dolore reiciendis! Illum
								tempora dicta rerum sequi earum! Quasi consectetur dolore fuga.
								Labore dignissimos corrupti aliquam facilis animi nulla, iure
								rem quod repellendus recusandae at beatae. In ipsum eius
								voluptas eos deleniti fuga itaque tempore sunt, aperiam possimus
								provident perspiciatis suscipit consequuntur atque nemo. Nam
								quia, ipsam nisi numquam nostrum architecto fugit amet magnam
								esse omnis dolorum corporis. Mollitia explicabo odio illo
								doloremque facilis ut, quasi corrupti repudiandae tempore vitae
								maiores sunt ducimus fugit dolores qui ipsa eaque! Facere illum
								ullam necessitatibus ipsa sequi expedita blanditiis dolorem
								dolores beatae, odit odio alias molestiae cum culpa reiciendis
								mollitia quibusdam veniam ut repudiandae animi saepe tempora
								quidem recusandae! Eveniet nesciunt in voluptates totam officia
								sit nulla placeat mollitia quis enim voluptatem, inventore saepe
								error commodi dignissimos, rem itaque, ducimus quidem? Odio, in
								pariatur dignissimos magnam alias unde eligendi quia dolores ab
								ratione porro, dolorem voluptas error commodi dolorum dicta rem
								voluptatem velit quaerat consectetur. Harum consectetur
								accusantium iure laborum fugit suscipit porro vitae tempora
								saepe culpa dolores animi provident id, laudantium ex earum
								neque quae vero placeat! Deserunt mollitia cumque voluptatibus,
								neque commodi, distinctio labore veniam repudiandae voluptatem
								molestiae quisquam adipisci est quas nihil nostrum quam
								voluptatum delectus velit sit quia tenetur explicabo!
								Perspiciatis, libero aliquam fuga consectetur obcaecati sunt
								illo minus cum officia alias non, suscipit ab, voluptas eos quod
								facere. Ducimus sunt quibusdam officiis, enim, doloremque atque
								eveniet, consequuntur velit ullam id eum at dolorum! Aliquid
								similique blanditiis asperiores, quasi inventore exercitationem
								ratione ad omnis velit iste et beatae est nisi? Voluptatibus,
								perspiciatis officia? Repellendus libero neque eveniet est ex at
								quaerat doloremque eum doloribus. Dicta corrupti, maxime qui
								iusto delectus illum, quibusdam eos fuga nam quos suscipit
								laboriosam illo. Similique esse nihil veritatis minima dolorem!
								Voluptatibus, nemo molestias. Magnam autem blanditiis est sed
								laboriosam quisquam sapiente quae! Illum placeat, voluptate
								commodi maiores earum officiis expedita, voluptatem nesciunt
								obcaecati nemo fuga esse, porro non quibusdam laboriosam.
								Molestiae aperiam fugit assumenda provident deleniti. Ex fugit
								ipsa dignissimos illum praesentium. Doloremque tenetur sed
								repellendus numquam, voluptas voluptates at distinctio deleniti,
								dolore sequi ipsam, unde harum veniam temporibus aperiam quae?
								Eligendi eaque iure in totam vel amet veniam neque soluta, sed
								exercitationem molestias quasi tempora quas, facere
								reprehenderit ullam. Aspernatur vel fugit architecto, explicabo
								laudantium dolorem rem et excepturi quae ea, nobis quidem!
							</TabsContent>
							<TabsContent value='others'>
								<TrackList
									tracks={tracks.splice(0, 3)}
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
