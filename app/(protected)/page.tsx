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

export const tracks: Track[] = [
	{
		id: '2',
		title: 'Synthwave Sunset',
		artist: 'Diego Fernandez',
		genre: 'field recording',
		duration: 344, // 5:44 in seconds
		cover: '/tracks/Synthwave-Sunset.png',
		url: 'https://oekyfpijfizbaexjkhbg.supabase.co/storage/v1/object/public/music/audiofiles/t2.mp3?t=2024-10-02T19%3A40%3A19.046Z',
		liked: true,
	},
	{
		id: '3',
		title: 'Neon Dreams',
		artist: 'Carlos Ruiz',
		genre: 'electronic music',
		duration: 474, // 7:54 in seconds
		cover: '/tracks/Neon-Dreams.png',
		url: 'https://oekyfpijfizbaexjkhbg.supabase.co/storage/v1/object/public/music/audiofiles/t3.mp3?t=2024-10-02T19%3A40%3A31.399Z',
		liked: false,
	},
	{
		id: '4',
		title: 'Cyber Flux',
		artist: 'Anna Novak',
		genre: 'electronic music',
		duration: 734, // 12:14 in seconds
		cover: '/tracks/Cyber-Flux.png',
		url: 'https://oekyfpijfizbaexjkhbg.supabase.co/storage/v1/object/public/music/audiofiles/t4.mp3?t=2024-10-02T19%3A40%3A40.642Z',
		liked: false,
	},
	{
		id: '5',
		title: 'Electric Horizon',
		artist: 'Diego Fernandez',
		genre: 'field recording',
		duration: 792, // 13:12 in seconds
		cover: '/tracks/Electric-Horizon.png',
		url: 'https://oekyfpijfizbaexjkhbg.supabase.co/storage/v1/object/public/music/audiofiles/t5.mp3?t=2024-10-02T19%3A40%3A59.206Z',
		liked: false,
	},
	{
		id: '6',
		title: 'Gravity Shift',
		artist: 'Carlos Ruiz',
		genre: 'electronic music',
		duration: 132, // 2:12 in seconds
		cover: '/tracks/Gravity-Shift.png',
		url: 'https://oekyfpijfizbaexjkhbg.supabase.co/storage/v1/object/public/music/audiofiles/t6.mp3?t=2024-10-02T19%3A41%3A18.707Z',
		liked: false,
	},
	{
		id: '1',
		title: 'Digital Mirage',
		artist: 'Anna Novak',
		genre: 'electronic music',
		duration: 233, // 3:53 in seconds
		cover: '/tracks/Digital-Mirage.png',
		url: 'https://oekyfpijfizbaexjkhbg.supabase.co/storage/v1/object/public/music/audiofiles/t1.mp3?t=2024-10-02T19%3A40%3A04.164Z',
		liked: false,
	},
	{
		id: '7',
		title: 'Leaves of 342',
		artist: 'Anna Novak',
		genre: 'electronic music',
		duration: 524, // 8:44 in seconds
		cover: '/tracks/Leaves-of-342.png',
		url: 'https://oekyfpijfizbaexjkhbg.supabase.co/storage/v1/object/public/music/audiofiles/t7.mp3?t=2024-10-02T19%3A41%3A31.746Z',
		liked: true,
	},
	{
		id: '8',
		title: 'Pulse of the City',
		artist: 'Diego Fernandez',
		genre: 'field recording',
		duration: 444, // 7:24 in seconds
		cover: '/tracks/Pulse-of-the-City.png',
		url: 'https://oekyfpijfizbaexjkhbg.supabase.co/storage/v1/object/public/music/audiofiles/t8.mp3?t=2024-10-02T19%3A41%3A46.065Z',
		liked: false,
	},
	{
		id: '9',
		title: 'Silent Frequencies',
		artist: 'Carlos Ruiz',
		genre: 'field recording',
		duration: 540, // 9:00 in seconds
		cover: '/tracks/Silent-Frequencies.png',
		url: 'https://oekyfpijfizbaexjkhbg.supabase.co/storage/v1/object/public/music/audiofiles/t9.mp3?t=2024-10-02T19%3A41%3A53.253Z',
		liked: true,
	},
	{
		id: '10',
		title: 'Digital Mirage',
		artist: 'Anna Novak',
		genre: 'electronic music',
		duration: 396, // 6:36 in seconds
		cover: '/tracks/Digital-Mirage.png',
		url: 'https://oekyfpijfizbaexjkhbg.supabase.co/storage/v1/object/public/music/audiofiles/t10.mp3?t=2024-10-02T19%3A42%3A08.713Z',
		liked: false,
	},
	{
		id: '11',
		title: 'Cyber Flux',
		artist: 'Diego Fernandez',
		genre: 'electronic music',
		duration: 504, // 8:24 in seconds
		cover: '/tracks/Cyber-Flux.png',
		url: 'https://oekyfpijfizbaexjkhbg.supabase.co/storage/v1/object/public/music/audiofiles/t11.mp3?t=2024-10-02T19%3A42%3A16.855Z',
		liked: false,
	},
	{
		id: '12',
		title: 'Neon Dreams',
		artist: 'Carlos Ruiz',
		genre: 'field recording',
		duration: 204, // 3:24 in seconds
		cover: '/tracks/Neon-Dreams.png',
		url: 'https://oekyfpijfizbaexjkhbg.supabase.co/storage/v1/object/public/music/audiofiles/t12.mp3',
		liked: false,
	},
];
