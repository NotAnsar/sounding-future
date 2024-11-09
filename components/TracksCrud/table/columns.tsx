'use client';

import { ColumnDef } from '@tanstack/react-table';

import { Button } from '../../ui/button';
import { ArrowUpDown } from 'lucide-react';
import { Artist, Track } from '@/config/dummy-data';
import { convertDateFormat } from '@/lib/utils';
import ActionCell from './ActionCell';
import Image from 'next/image';
import Link from 'next/link';
import { Icons } from '@/components/icons/track-icons';

export const columns: ColumnDef<Track>[] = [
	{
		accessorKey: 'cover',
		header: '',
		cell: ({ row }) => {
			const track = row.original;
			return (
				<div className='max-w-14'>
					<Image
						src={track.cover}
						alt={track.title}
						width={56}
						height={56}
						className='min-w-14 max-w-14 h-auto aspect-square object-cover border border-border rounded-md '
					/>
				</div>
			);
		},
	},
	{
		accessorKey: 'title',
		header: '',
		cell: ({ row }) => {
			const track = row.original;
			return (
				<>
					<Link
						href={`/tracks/${track.id}`}
						className={'text-base font-semibold line-clamp-1 hover:opacity-80'}
					>
						{track.title}
					</Link>
					<h6 className='text-sm font-light text-muted line-clamp-1 hidden sm:block'>
						{track.genre.name}
					</h6>
				</>
			);
		},
	},
	{
		accessorKey: 'artist',
		accessorFn: (row) => row.artist.name,
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					className='hover:bg-transparent hover:text-foreground px-0'
				>
					Artist
					<ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
			);
		},
		cell: ({ row }) => {
			const artist = row.original.artist as Artist;

			return (
				<div>
					<Link
						href={`/artists/${artist.id}`}
						className='text-muted text-base font-semibold text-nowrap'
					>
						{artist.name}
					</Link>
				</div>
			);
		},
	},
	{
		accessorKey: 'created_at',
		cell: ({ row }) => {
			return (
				<div className='text-sm text-nowrap'>
					{convertDateFormat(new Date(row.getValue('created_at')))}
				</div>
			);
		},
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					className='hover:bg-transparent hover:text-foreground px-0'
				>
					Uploaded At
					<ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
			);
		},
	},
	{
		accessorKey: 'played',
		cell: ({ row }) => {
			return (
				<div className='text-sm text-nowrap flex gap-1 items-center'>
					<Icons.played className='w-4 h-auto aspect-square fill-muted' />
					<p>{row.getValue('played')}</p>
				</div>
			);
		},
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					className='hover:bg-transparent hover:text-foreground px-0'
				>
					Played
					<ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
			);
		},
	},
	{
		accessorKey: 'liked',
		cell: ({ row }) => {
			return (
				<div className='text-sm text-nowrap flex gap-1 items-center '>
					<Icons.liked className='w-4 h-auto aspect-square fill-muted' />
					<p>{row.getValue('liked')}</p>
				</div>
			);
		},
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					className='hover:bg-transparent hover:text-foreground px-0'
				>
					Liked
					<ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
			);
		},
	},
	{
		id: 'actions',
		cell: ({ row }) => <ActionCell id={row.original.id} />,
	},
];
