import HeaderBanner from '@/components/HeaderBanner';
import ArtistsCarousel from '@/components/home/ArtistCarousel';
import CollectionsCarousel from '@/components/home/CollectionsCarousel';
import GenresCarousel from '@/components/home/GenresCarousel';
import TracksCarousel from '@/components/home/NewTracks';
// import TrackList from '@/components/tracks/TrackList';
import { Track } from '@/context/AudioContext';

export default function page() {
	return (
		<>
			<HeaderBanner
				img={'/home.png'}
				title='Explore 3D Audio Music'
				className='mb-8'
			/>
			<div className='flex flex-col gap-12'>
				<TracksCarousel
					tracks={[...tracks, ...tracks, ...tracks]}
					title='New Tracks'
					className='xl:w-2/3'
				/>
				<GenresCarousel className='xl:w-2/3' title='Tracks by genre' />
				<CollectionsCarousel className='xl:w-2/3' title='Curated Collections' />
				<ArtistsCarousel className='xl:w-2/3' />
			</div>
		</>
	);
}

const tracks: Track[] = [
	{
		id: '1',
		title: 'Digital Mirage',
		artist: 'Anna Novak',
		genre: 'electronic music',
		duration: 147,
		cover: '/Digital-Mirage.png',
		// url: 'https://oekyfpijfizbaexjkhbg.supabase.co/storage/v1/object/public/music/audiofiles/t10.mp3',
		url: 'https://cdn-preview-d.dzcdn.net/stream/c-deda7fa9316d9e9e880d2c6207e92260-10.mp3',
	},
	{
		id: '2',
		title: 'Synthwave Sunset',
		artist: 'Diego Fernandez',
		genre: 'field recording',
		duration: 120,
		cover: '/Synthwave-Sunset.png',
		liked: true,
		// url: 'https://oekyfpijfizbaexjkhbg.supabase.co/storage/v1/object/public/music/audiofiles/t2.mp3',
		url: 'https://cdn-preview-e.dzcdn.net/stream/c-e77d23e0c8ed7567a507a6d1b6a9ca1b-11.mp3',
	},
	{
		id: '3',
		title: 'Neon Dreams',
		artist: 'Carlos Ruiz',
		genre: 'electronic music',
		duration: 128,
		cover: '/Neon-Dreams.png',
		// url: 'https://oekyfpijfizbaexjkhbg.supabase.co/storage/v1/object/public/music/audiofiles/t3.mp3',
		url: 'https://cdn-preview-b.dzcdn.net/stream/c-b2e0166bba75a78251d6dca9c9c3b41a-9.mp3',
	},
];
