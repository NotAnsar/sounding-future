import HeaderBanner from '@/components/HeaderBanner';
import ArtistsCarousel from '@/components/home/ArtistCarousel';
import PartnersCarousel from '@/components/home/CollectionsCarousel';
import GenresCarousel from '@/components/home/GenresCarousel';
import TracksCarousel from '@/components/home/NewTracks';
import { Button } from '@/components/ui/button';
import { getArtists } from '@/db/artist';
import { getGenres } from '@/db/genre';
import { getPartners } from '@/db/partner';
import { getPublicTracks } from '@/db/tracks';

export default async function page() {
	const [tracks, genres, partners, artists] = await Promise.all([
		getPublicTracks(8, 'new'),
		getGenres(),
		getPartners(),
		getArtists(8),
	]);

	return (
		<>
			<HeaderBanner
				img={'/banners/home.jpg'}
				title='Explore 3D Audio Music'
				className='mb-8'
			/>
			<div className='grid grid-cols-3 gap-6'>
				<div className='flex flex-col gap-12 col-span-full xl:col-span-2'>
					{!tracks.error && (
						<TracksCarousel tracks={tracks.data} title='New Tracks' />
					)}
					{!genres.error && (
						<GenresCarousel title='Tracks by genre' genres={genres.data} />
					)}
					{!partners.error && (
						<PartnersCarousel
							title='Curated Collections'
							partners={partners.data}
						/>
					)}

					{!artists.error && <ArtistsCarousel artists={artists.data} />}
				</div>
				<div className='col-span-full xl:col-span-1 text-white flex flex-col gap-6'>
					<div
						className='p-6 rounded-3xl space-y-5 bg-[#B95]'
						style={{
							backgroundImage: "url('/banner-texture-2 1.png')",
							backgroundSize: 'cover',
							backgroundPosition: 'center',
							backgroundRepeat: 'no-repeat',
						}}
					>
						<h2 className='text-4xl font-bold'>Title</h2>
						<p>
							Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt
							corporis labore iste voluptates quos in facilis rem dolores,
							deleniti dolorum, sequi, repellendus et molestias incidunt enim
							sapiente voluptatibus pariatur asperiores? Lorem ipsum, dolor sit
							amet consectetur adipisicing elit. Deserunt eum quas voluptatum
							dignissimos deleniti enim amet aliquid facilis, voluptatem tempora
							ab dolorum, corrupti unde provident soluta molestiae id explicabo.
							Similique, cumque. Accusamus officia ducimus fugiat voluptatibus
							ipsam numquam porro natus voluptates consequuntur, nihil
							assumenda.
						</p>

						<Button>Explore</Button>
					</div>
					<div className='p-6 bg-[#481B95] rounded-3xl space-y-5'>
						<h2 className='text-4xl font-bold'>Title</h2>
						<p>
							Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt
							corporis labore iste voluptates quos in facilis rem dolores,
							deleniti dolorum, sequi, repellendus et molestias incidunt enim
							sapiente voluptatibus pariatur asperiores?
						</p>

						<Button>Explore</Button>
					</div>

					<div className='p-6 bg-[#485] rounded-3xl space-y-5'>
						<h2 className='text-4xl font-bold'>Title</h2>
						<p>
							Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt
							corporis labore iste voluptates quos in facilis rem dolores,
							deleniti dolorum, sequi, repellendus et molestias incidunt enim
							sapiente voluptatibus pariatur asperiores?
						</p>

						<Button>Explore</Button>
					</div>
				</div>
			</div>
		</>
	);
}
