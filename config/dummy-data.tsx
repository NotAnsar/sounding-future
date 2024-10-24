export type Collection = {
	id: string;
	picture: string;
	name: string;
	country: string;
};

export const collections: Collection[] = [
	{
		id: '1',
		picture: '/collections/Audiomatch.png',
		name: 'Audiomatch',
		country: 'Austria',
	},
	{
		id: '2',
		picture: '/collections/Audiostuff.png',
		name: 'Audiostuff',
		country: 'USA',
	},
	{
		id: '3',
		picture: '/collections/Soco festival.png',
		name: 'Soco festival',
		country: 'France',
	},
	{
		id: '4',
		picture: '/collections/Unsounded.png',
		name: 'Unsounded',
		country: 'India',
	},
];

export interface Artist {
	id: string;
	picture: string;
	name: string;
}

export type Track = {
	id: string;
	title: string;
	artist: Artist;
	collection: Collection; // Added this field
	genre: string;
	duration: number;
	cover: string;
	url: string;
	liked: boolean;
};

export const artists: Artist[] = [
	{
		id: '1',
		picture: '/artists/Anna-Novak.png',
		name: 'Anna Novak',
	},
	{
		id: '2',
		picture: '/artists/Carlos-Ruiz.png',
		name: 'Carlos Ruiz',
	},
	{
		id: '3',
		picture: '/artists/Chen-Wei.png',
		name: 'Chen Wei',
	},
	{
		id: '4',
		picture: '/artists/David-Müller.png',
		name: 'David Müller',
	},
	{
		id: '5',
		picture: '/artists/Diego-Fernandez.png',
		name: 'Diego Fernandez',
	},
	{
		id: '6',
		picture: '/artists/Elena-Rossi.png',
		name: 'Elena Rossi',
	},
	{
		id: '7',
		picture: '/artists/Juan-Martinez.png',
		name: 'Juan Martinez',
	},
	{
		id: '8',
		picture: '/artists/Liam-O-Connor.png',
		name: "Liam O'Connor",
	},
	{
		id: '9',
		picture: '/artists/Luka-Petrovic.png',
		name: 'Luka Petrovic',
	},
	{
		id: '10',
		picture: '/artists/Maria-Silva.png',
		name: 'Maria Silva',
	},
	{
		id: '11',
		picture: '/artists/Max-Harris.png',
		name: 'Max Harris',
	},
	{
		id: '12',
		picture: '/artists/Sidney-Clifford.png',
		name: 'Sidney Clifford',
	},
	{
		id: '13',
		picture: '/artists/Yasmin-Al-Sayed.png',
		name: 'Yasmin Al-Sayed',
	},
];

export const tracks: Track[] = [
	{
		id: '3',
		title: 'Neon Dreams',
		artist: artists.find((a) => a.name === 'Carlos Ruiz')!,
		collection: collections.find((c) => c.name === 'Audiomatch')!,
		genre: 'electronic music',
		duration: 474,
		cover: '/tracks/Neon-Dreams.png',
		url: 'https://oekyfpijfizbaexjkhbg.supabase.co/storage/v1/object/public/music/audiofiles/t3.mp3?t=2024-10-02T19%3A40%3A31.399Z',
		liked: false,
	},
	{
		id: '2',
		title: 'Synthwave Sunset',
		artist: artists.find((a) => a.name === 'Diego Fernandez')!,
		collection: collections.find((c) => c.name === 'Audiostuff')!,
		genre: 'field recording',
		duration: 344,
		cover: '/tracks/Synthwave-Sunset.png',
		url: 'https://oekyfpijfizbaexjkhbg.supabase.co/storage/v1/object/public/music/audiofiles/t2.mp3?t=2024-10-02T19%3A40%3A19.046Z',
		liked: true,
	},
	{
		id: '4',
		title: 'Cyber Flux',
		artist: artists.find((a) => a.name === 'Anna Novak')!,
		collection: collections.find((c) => c.name === 'Soco festival')!,
		genre: 'electronic music',
		duration: 734,
		cover: '/tracks/Cyber-Flux.png',
		url: 'https://oekyfpijfizbaexjkhbg.supabase.co/storage/v1/object/public/music/audiofiles/t4.mp3?t=2024-10-02T19%3A40%3A40.642Z',
		liked: false,
	},
	{
		id: '5',
		title: 'Electric Horizon',
		artist: artists.find((a) => a.name === 'Diego Fernandez')!,
		collection: collections.find((c) => c.name === 'Unsounded')!,
		genre: 'field recording',
		duration: 792,
		cover: '/tracks/Electric-Horizon.png',
		url: 'https://oekyfpijfizbaexjkhbg.supabase.co/storage/v1/object/public/music/audiofiles/t5.mp3?t=2024-10-02T19%3A40%3A59.206Z',
		liked: false,
	},
	{
		id: '6',
		title: 'Gravity Shift',
		artist: artists.find((a) => a.name === 'Carlos Ruiz')!,
		collection: collections.find((c) => c.name === 'Audiomatch')!,
		genre: 'electronic music',
		duration: 132,
		cover: '/tracks/Gravity-Shift.png',
		url: 'https://oekyfpijfizbaexjkhbg.supabase.co/storage/v1/object/public/music/audiofiles/t6.mp3?t=2024-10-02T19%3A41%3A18.707Z',
		liked: false,
	},
	{
		id: '1',
		title: 'Digital Mirage',
		artist: artists.find((a) => a.name === 'Anna Novak')!,
		collection: collections.find((c) => c.name === 'Audiostuff')!,
		genre: 'electronic music',
		duration: 233,
		cover: '/tracks/Digital-Mirage.png',
		url: 'https://oekyfpijfizbaexjkhbg.supabase.co/storage/v1/object/public/music/audiofiles/t1.mp3?t=2024-10-02T19%3A40%3A04.164Z',
		liked: false,
	},
	{
		id: '7',
		title: 'Leaves of 342',
		artist: artists.find((a) => a.name === 'Anna Novak')!,
		collection: collections.find((c) => c.name === 'Soco festival')!,
		genre: 'electronic music',
		duration: 524,
		cover: '/tracks/Leaves-of-342.png',
		url: 'https://oekyfpijfizbaexjkhbg.supabase.co/storage/v1/object/public/music/audiofiles/t7.mp3?t=2024-10-02T19%3A41%3A31.746Z',
		liked: true,
	},
	{
		id: '8',
		title: 'Pulse of the City',
		artist: artists.find((a) => a.name === 'Diego Fernandez')!,
		collection: collections.find((c) => c.name === 'Unsounded')!,
		genre: 'field recording',
		duration: 444,
		cover: '/tracks/Pulse-of-the-City.png',
		url: 'https://oekyfpijfizbaexjkhbg.supabase.co/storage/v1/object/public/music/audiofiles/t8.mp3?t=2024-10-02T19%3A41%3A46.065Z',
		liked: false,
	},
	{
		id: '9',
		title: 'Silent Frequencies',
		artist: artists.find((a) => a.name === 'Carlos Ruiz')!,
		collection: collections.find((c) => c.name === 'Audiomatch')!,
		genre: 'field recording',
		duration: 540,
		cover: '/tracks/Silent-Frequencies.png',
		url: 'https://oekyfpijfizbaexjkhbg.supabase.co/storage/v1/object/public/music/audiofiles/t9.mp3?t=2024-10-02T19%3A41%3A53.253Z',
		liked: true,
	},
	{
		id: '10',
		title: 'Digital Mirage',
		artist: artists.find((a) => a.name === 'Anna Novak')!,
		collection: collections.find((c) => c.name === 'Soco festival')!,
		genre: 'electronic music',
		duration: 396,
		cover: '/tracks/Digital-Mirage.png',
		url: 'https://oekyfpijfizbaexjkhbg.supabase.co/storage/v1/object/public/music/audiofiles/t10.mp3?t=2024-10-02T19%3A42%3A08.713Z',
		liked: false,
	},
	{
		id: '11',
		title: 'Cyber Flux',
		artist: artists.find((a) => a.name === 'Diego Fernandez')!,
		collection: collections.find((c) => c.name === 'Unsounded')!,
		genre: 'electronic music',
		duration: 504,
		cover: '/tracks/Cyber-Flux.png',
		url: 'https://oekyfpijfizbaexjkhbg.supabase.co/storage/v1/object/public/music/audiofiles/t11.mp3?t=2024-10-02T19%3A42%3A16.855Z',
		liked: false,
	},
	{
		id: '12',
		title: 'Neon Dreams',
		artist: artists.find((a) => a.name === 'Carlos Ruiz')!,
		collection: collections.find((c) => c.name === 'Audiostuff')!,
		genre: 'field recording',
		duration: 204,
		cover: '/tracks/Neon-Dreams.png',
		url: 'https://oekyfpijfizbaexjkhbg.supabase.co/storage/v1/object/public/music/audiofiles/t12.mp3',
		liked: false,
	},
];

export type Genre = {
	id: string;
	name: string;
	from: string;
	to: string;
};

export const gradients = [
	'linear-gradient(180deg,  0%,  100%)',
	'linear-gradient(180deg, 100%)',
	'linear-gradient(180deg, 100%)',
	'linear-gradient(180deg, 100%)',
	'linear-gradient(180deg, 100%)',
];

export const genres = [
	{ id: '1', name: 'Electronic Music', from: '#A42F67', to: '#513383' },
	{ id: '2', name: 'Field Recordings', from: '#267B43', to: '#2F489F' },
	{ id: '3', name: 'Contemporary Music', from: '#7F8128', to: '#1F1D7B' },
	{ id: '4', name: 'Game Audio', from: '#f46217', to: '#0b486b' },
	{ id: '5', name: 'Sound Art', from: '#4b1248', to: '#efc27b' },
];
