export type Collection = {
	id: string;
	picture: string;
	name: string;
	country: string;
	studioPic: string;
	tracks: number;
	liked: number;
	played: number;
};

export interface Artist {
	id: string;
	picture: string;
	name: string;
	genres: Genre[]; //min 1 , max 3
}

export type Genre = {
	id: string;
	name: string;
	from: string;
	to: string;
};

export const collections: Collection[] = [
	{
		id: '1',
		picture: '/collections/Audiomatch.png',
		name: 'Audiomatch',
		country: 'Austria',
		studioPic: '/curators-about/Audiomatch.png',
		tracks: 100,
		liked: 50,
		played: 1000,
	},
	{
		id: '2',
		picture: '/collections/Audiostuff.png',
		name: 'Audiostuff',
		country: 'United States',
		studioPic: '/curators-about/Audiostuff.png',
		tracks: 75,
		liked: 30,
		played: 750,
	},
	{
		id: '3',
		picture: '/collections/Soco festival.png',
		name: 'Soco festival',
		country: 'France',
		studioPic: '/curators-about/Soco-Festival.png',
		tracks: 120,
		liked: 80,
		played: 1200,
	},
	{
		id: '4',
		picture: '/collections/Unsounded.png',
		name: 'Unsounded',
		country: 'India',
		studioPic: '/curators-about/Unsounded.png',
		tracks: 90,
		liked: 40,
		played: 900,
	},
];

export const genres: Genre[] = [
	{ id: '1', name: 'Electronic Music', from: '#A42F67', to: '#513383' },

	{ id: '2', name: 'Field Recordings', from: '#267B43', to: '#2F489F' },
	{ id: '3', name: 'Contemporary Music', from: '#7F8128', to: '#1F1D7B' },
	{ id: '4', name: 'Game Audio', from: '#f46217', to: '#0b486b' },
	{ id: '5', name: 'Sound Art', from: '#4b1248', to: '#efc27b' },
];

export const artists: Artist[] = [
	{
		id: '1',
		picture: '/artists/Anna-Novak.png',
		name: 'Anna Novak',
		genres: [genres[2], genres[4]], // Contemporary Music, Sound Art
	},
	{
		id: '2',
		picture: '/artists/Carlos-Ruiz.png',
		name: 'Carlos Ruiz',
		genres: [genres[0], genres[2], genres[4]], // Electronic Music, Contemporary Music, Sound Art
	},
	{
		id: '3',
		picture: '/artists/Chen-Wei.png',
		name: 'Chen Wei',
		genres: [genres[4]], // Sound Art
	},
	{
		id: '4',
		picture: '/artists/David-Müller.png',
		name: 'David Müller',
		genres: [genres[0], genres[3]], // Electronic Music, Game Audio
	},
	{
		id: '5',
		picture: '/artists/Diego-Fernandez.png',
		name: 'Diego Fernandez',
		genres: [genres[2], genres[3], genres[4]], // Contemporary Music, Game Audio, Sound Art
	},
	{
		id: '6',
		picture: '/artists/Elena-Rossi.png',
		name: 'Elena Rossi',
		genres: [genres[0], genres[2]], // Electronic Music, Contemporary Music
	},
	{
		id: '7',
		picture: '/artists/Juan-Martinez.png',
		name: 'Juan Martinez',
		genres: [genres[1], genres[2], genres[4]], // Field Recordings, Contemporary Music, Sound Art
	},
	{
		id: '8',
		picture: '/artists/Liam-O-Connor.png',
		name: "Liam O'Connor",
		genres: [genres[0], genres[3]], // Electronic Music, Game Audio
	},
	{
		id: '9',
		picture: '/artists/Luka-Petrovic.png',
		name: 'Luka Petrovic',
		genres: [genres[2], genres[3], genres[4]], // Contemporary Music, Game Audio, Sound Art
	},
	{
		id: '10',
		picture: '/artists/Maria-Silva.png',
		name: 'Maria Silva',
		genres: [genres[1], genres[4]], // Field Recordings, Sound Art
	},
	{
		id: '11',
		picture: '/artists/Max-Harris.png',
		name: 'Max Harris',
		genres: [genres[0], genres[3], genres[4]], // Electronic Music, Game Audio, Sound Art
	},
	{
		id: '12',
		picture: '/artists/Sidney-Clifford.png',
		name: 'Sidney Clifford',
		genres: [genres[0], genres[2]], // Electronic Music, Contemporary Music
	},
	{
		id: '13',
		picture: '/artists/Yasmin-Al-Sayed.png',
		name: 'Yasmin Al-Sayed',
		genres: [genres[1], genres[2], genres[4]], // Field Recordings, Contemporary Music, Sound Art
	},
];
export type Track = {
	id: string;
	title: string;
	artist: Artist;
	collection: Collection;
	genre: Genre;
	duration: number;
	created_at: string;
	cover: string;
	url: string;
	liked: number;
	played: number;
	published: boolean; // New property
};

export const tracks: Track[] = [
	{
		id: '3',
		title: 'Neon Dreams',
		artist: artists.find((a) => a.name === 'Carlos Ruiz')!,
		collection: collections.find((c) => c.name === 'Audiomatch')!,
		genre: genres.find((c) => c.name === 'Electronic Music')!,
		duration: 474,
		cover: '/tracks/Neon-Dreams.png',
		url: 'https://oekyfpijfizbaexjkhbg.supabase.co/storage/v1/object/public/music/audiofiles/t3.mp3?t=2024-10-02T19%3A40%3A31.399Z',
		liked: 5,
		played: 120,
		created_at: '2024-10-02T19:40:31Z',
		published: true,
	},
	{
		id: '2',
		title: 'Synthwave Sunset',
		artist: artists.find((a) => a.name === 'Diego Fernandez')!,
		collection: collections.find((c) => c.name === 'Audiostuff')!,
		genre: genres.find((c) => c.name === 'Field Recordings')!,
		duration: 344,
		cover: '/tracks/Synthwave-Sunset.png',
		url: 'https://oekyfpijfizbaexjkhbg.supabase.co/storage/v1/object/public/music/audiofiles/t2.mp3?t=2024-10-02T19%3A40%3A19.046Z',
		liked: 2,
		played: 75,
		created_at: '2024-10-02T19:40:19Z',
		published: true,
	},
	{
		id: '4',
		title: 'Cyber Flux',
		artist: artists.find((a) => a.name === 'Anna Novak')!,
		collection: collections.find((c) => c.name === 'Soco festival')!,
		genre: genres.find((c) => c.name === 'Electronic Music')!,
		duration: 734,
		cover: '/tracks/Cyber-Flux.png',
		url: 'https://oekyfpijfizbaexjkhbg.supabase.co/storage/v1/object/public/music/audiofiles/t4.mp3?t=2024-10-02T19%3A40%3A40.642Z',
		liked: 0,
		played: 10,
		created_at: '2022-10-23T19:40:40Z',
		published: false,
	},
	{
		id: '5',
		title: 'Electric Horizon',
		artist: artists.find((a) => a.name === 'Diego Fernandez')!,
		collection: collections.find((c) => c.name === 'Unsounded')!,
		genre: genres.find((c) => c.name === 'Field Recordings')!,
		duration: 792,
		cover: '/tracks/Electric-Horizon.png',
		url: 'https://oekyfpijfizbaexjkhbg.supabase.co/storage/v1/object/public/music/audiofiles/t5.mp3?t=2024-10-02T19%3A40%3A59.206Z',
		liked: 8,
		played: 200,
		created_at: '2024-10-12T19:40:59Z',
		published: true,
	},
	{
		id: '6',
		title: 'Gravity Shift',
		artist: artists.find((a) => a.name === 'Carlos Ruiz')!,
		collection: collections.find((c) => c.name === 'Audiomatch')!,
		genre: genres.find((c) => c.name === 'Electronic Music')!,
		duration: 132,
		cover: '/tracks/Gravity-Shift.png',
		url: 'https://oekyfpijfizbaexjkhbg.supabase.co/storage/v1/object/public/music/audiofiles/t6.mp3?t=2024-10-02T19%3A41%3A12.623Z',
		liked: 3,
		played: 90,
		created_at: '2021-10-02T19:41:12Z',
		published: true,
	},
	{
		id: '7',
		title: 'Waves of the Ocean',
		artist: artists.find((a) => a.name === 'Anna Novak')!,
		collection: collections.find((c) => c.name === 'Soco festival')!,
		genre: genres.find((c) => c.name === 'Field Recordings')!,
		duration: 540,
		cover: '/tracks/Leaves-of-342.png',
		url: 'https://oekyfpijfizbaexjkhbg.supabase.co/storage/v1/object/public/music/audiofiles/t7.mp3?t=2024-10-02T19%3A41%3A31.098Z',
		liked: 6,
		played: 45,
		created_at: '2024-1-02T19:41:31Z',
		published: true,
	},
	{
		id: '8',
		title: 'Pulse of the City',
		artist: artists.find((a) => a.name === 'Diego Fernandez')!,
		collection: collections.find((c) => c.name === 'Unsounded')!,
		genre: genres.find((c) => c.name === 'Field Recordings')!,
		duration: 444,
		cover: '/tracks/Pulse-of-the-City.png',
		url: 'https://oekyfpijfizbaexjkhbg.supabase.co/storage/v1/object/public/music/audiofiles/t8.mp3?t=2024-10-02T19%3A41%3A46.065Z',
		liked: 1,
		played: 65,
		created_at: '2020-10-22T19:41:46Z',
		published: true,
	},
	{
		id: '9',
		title: 'Silent Frequencies',
		artist: artists.find((a) => a.name === 'Carlos Ruiz')!,
		collection: collections.find((c) => c.name === 'Audiomatch')!,
		genre: genres.find((c) => c.name === 'Field Recordings')!,
		duration: 540,
		cover: '/tracks/Silent-Frequencies.png',
		url: 'https://oekyfpijfizbaexjkhbg.supabase.co/storage/v1/object/public/music/audiofiles/t9.mp3?t=2024-10-02T19%3A41%3A53.253Z',
		liked: 3,
		played: 50,
		created_at: '2021-10-02T19:41:53Z',
		published: true,
	},
	{
		id: '10',
		title: 'Digital Mirage',
		artist: artists.find((a) => a.name === 'Anna Novak')!,
		collection: collections.find((c) => c.name === 'Soco festival')!,
		genre: genres.find((c) => c.name === 'Electronic Music')!,
		duration: 396,
		cover: '/tracks/Digital-Mirage.png',
		url: 'https://oekyfpijfizbaexjkhbg.supabase.co/storage/v1/object/public/music/audiofiles/t10.mp3?t=2024-10-02T19%3A42%3A08.713Z',
		liked: 4,
		played: 150,
		created_at: '2022-10-02T19:42:08Z',
		published: false,
	},
	{
		id: '11',
		title: 'Cyber Flux',
		artist: artists.find((a) => a.name === 'Diego Fernandez')!,
		collection: collections.find((c) => c.name === 'Unsounded')!,
		genre: genres.find((c) => c.name === 'Electronic Music')!,
		duration: 504,
		cover: '/tracks/Cyber-Flux.png',
		url: 'https://oekyfpijfizbaexjkhbg.supabase.co/storage/v1/object/public/music/audiofiles/t11.mp3?t=2024-10-02T19%3A42%3A16.855Z',
		liked: 7,
		played: 25,
		created_at: '2024-4-02T19:42:16Z',
		published: false,
	},
	{
		id: '12',
		title: 'Neon Dreams',
		artist: artists.find((a) => a.name === 'Carlos Ruiz')!,
		collection: collections.find((c) => c.name === 'Audiostuff')!,
		genre: genres.find((c) => c.name === 'Field Recordings')!,
		duration: 204,
		cover: '/tracks/Neon-Dreams.png',
		url: 'https://oekyfpijfizbaexjkhbg.supabase.co/storage/v1/object/public/music/audiofiles/t12.mp3',
		liked: 3,
		played: 12,
		created_at: '2024-9-02T19:42:30Z',
		published: false,
	},
	{
		id: '13',
		title: 'Leaves of 342',
		artist: artists.find((a) => a.name === 'Anna Novak')!,
		collection: collections.find((c) => c.name === 'Soco festival')!,
		genre: genres.find((c) => c.name === 'Field Recordings')!,
		duration: 540,
		cover: '/tracks/Leaves-of-342.png',
		url: 'https://oekyfpijfizbaexjkhbg.supabase.co/storage/v1/object/public/music/audiofiles/t7.mp3?t=2024-10-02T19%3A41%3A31.098Z',
		liked: 45,
		played: 200,
		created_at: '2024-10-04T19:41:31Z',
		published: false,
	},
];
