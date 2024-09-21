import HeaderBanner from '@/components/HeaderBanner';
import TrackList from '@/components/tracks/TrackList';
import { Track } from '@/context/AudioContext';

export default function page() {
	return (
		<>
			<HeaderBanner img={'/home.png'} title='Explore 3D Audio Music' />
			<TrackList tracks={tracks} />
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
		url: 'https://oekyfpijfizbaexjkhbg.supabase.co/storage/v1/object/public/music/audiofiles/t10.mp3',
	},
	{
		id: '2',
		title: 'Synthwave Sunset',
		artist: 'Diego Fernandez',
		genre: 'field recording',
		duration: 120,
		cover: '/Synthwave-Sunset.png',
		liked: true,
		url: 'https://oekyfpijfizbaexjkhbg.supabase.co/storage/v1/object/public/music/audiofiles/t2.mp3',
	},
	{
		id: '3',
		title: 'Neon Dreams',
		artist: 'Carlos Ruiz',
		genre: 'electronic music',
		duration: 128,
		cover: '/Neon-Dreams.png',
		url: 'https://oekyfpijfizbaexjkhbg.supabase.co/storage/v1/object/public/music/audiofiles/t3.mp3',
	},
];
