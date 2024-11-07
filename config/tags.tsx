export type SourceFormat = { id: string; name: string; created_at: string };

export const sourceFormatData: SourceFormat[] = [
	{
		id: '1',
		name: 'First Order Ambisonics',
		created_at: '2023-04-01T12:00:00Z',
	},
	{
		id: '2',
		name: 'High Order Ambisonics',
		created_at: '2023-04-02T14:30:00Z',
	},
	{
		id: '3',
		name: 'Binaural',
		created_at: '2023-04-03T09:15:00Z',
	},
	{
		id: '4',
		name: 'Quad',
		created_at: '2023-04-04T16:45:00Z',
	},
	{
		id: '5',
		name: 'Octogonal',
		created_at: '2023-04-05T11:30:00Z',
	},
	{
		id: '6',
		name: '5.1',
		created_at: '2023-04-06T13:00:00Z',
	},
	{
		id: '7',
		name: '7.1',
		created_at: '2023-04-07T15:20:00Z',
	},
	{
		id: '8',
		name: '9.1',
		created_at: '2023-04-08T10:45:00Z',
	},
];

export type GenreTag = {
	id: string;
	name: string;
	created_at: string;
};

export const genreTags: GenreTag[] = [
	{
		id: '1',
		name: 'Electronic Music',
		created_at: '2023-04-01T12:00:00Z',
	},
	{
		id: '2',
		name: 'Electroacoustic music',
		created_at: '2023-04-02T14:30:00Z',
	},
	{
		id: '3',
		name: 'Game Audio',
		created_at: '2023-04-03T09:15:00Z',
	},
	{
		id: '4',
		name: 'Sound Art',
		created_at: '2023-04-04T16:45:00Z',
	},
	{
		id: '5',
		name: 'Contemporary music',
		created_at: '2023-04-05T11:30:00Z',
	},
	{
		id: '6',
		name: 'Fieldrecording',
		created_at: '2023-04-06T13:00:00Z',
	},
];
