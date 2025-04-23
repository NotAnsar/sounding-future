'use client';

import { ColumnDef } from '@tanstack/react-table';

import { Button } from '../../ui/button';
import { ArrowUpDown, Shield, ShieldCheck } from 'lucide-react';
import ActionCell from './ActionCell';
import Image from 'next/image';
import Link from 'next/link';
import { Icons } from '@/components/icons/track-icons';
import Badge from '@/components/Badge';
import { TrackWithCounts } from '@/db/tracks';
import { formatTimestamp } from '@/lib/utils';
import LikesPopUp from './LikesPopUp';

export const columns: ColumnDef<TrackWithCounts>[] = [
	{
		accessorKey: 'cover',
		header: '',
		cell: ({ row }) => {
			const track = row.original;
			return (
				<div className='max-w-14'>
					{track?.cover ? (
						<Image
							src={track.cover}
							alt={track.title}
							width={56}
							height={56}
							className='min-w-14 max-w-14 h-auto aspect-square object-cover border border-border rounded-md '
						/>
					) : (
						<div className='min-w-14 max-w-14 h-auto aspect-square object-cover border border-border rounded-md bg-muted' />
					)}
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
						href={`/tracks/${track.slug}`}
						className={
							'text-base font-semibold line-clamp-1 hover:opacity-80 max-w-40 text-nowrap'
						}
					>
						{track.title}
					</Link>
					<h6 className='text-sm font-light text-muted line-clamp-1 hidden sm:block'>
						{track.artists.map((artist) => artist.artist.name).join(', ')}
					</h6>
				</>
			);
		},
	},
	{
		accessorKey: 'artist',
		accessorFn: (row) =>
			row.artists.map((artist) => artist.artist.name).join(', '),
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					className='hover:bg-transparent hover:text-foreground px-0'
				>
					Artist Name
					<ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
			);
		},
		cell: ({ row }) => {
			const name = row?.original?.artists
				.map((artist) => artist.artist.name)
				.join(', ');

			return <h1 className='text-muted text-base font-semibold'>{name}</h1>;
		},
	},
	{
		accessorKey: 'curator',
		accessorFn: (row) => row.curator?.name,
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					className='hover:bg-transparent hover:text-foreground px-0'
				>
					Curated By
					<ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
			);
		},
		cell: ({ row }) => {
			const partner = row?.original?.curator;

			return (
				<h1 className='text-muted text-base font-semibold'>
					{partner?.name || null}
				</h1>
			);
		},
	},

	{
		accessorKey: 'releaseYear',
		cell: ({ row }) => {
			return (
				<div className='text-sm text-nowrap'>{row.getValue('releaseYear')}</div>
			);
		},
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					className='hover:bg-transparent hover:text-foreground px-0'
				>
					Release Year
					<ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
			);
		},
	},
	{
		accessorKey: 'createdAt',
		cell: ({ row }) => {
			return (
				<div className='text-sm text-nowrap'>
					{formatTimestamp(row.getValue('createdAt'))}
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
					Added At
					<ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
			);
		},
	},
	{
		accessorKey: '_count.listeners',
		cell: ({ row }) => {
			const listeners = row.original._count?.listeners ?? 0;
			return (
				<div className='text-sm text-nowrap flex gap-1 items-center'>
					<Icons.played className='w-4 h-auto aspect-square fill-muted' />
					<p>{listeners}</p>
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
		accessorKey: '_count.likes',
		cell: ({ row }) => <LikesPopUp track={row.original} />,
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
		accessorKey: 'published',
		header: () => <div className='text-nowrap text-sm'>Status</div>,
		cell: ({ row }) => {
			const published = row.getValue('published');

			return (
				<Badge variant={published ? 'success' : 'archive'}>
					{published ? (
						<>
							<ShieldCheck className='w-3 h-auto' /> Published
						</>
					) : (
						<>
							<Shield className='w-3 h-auto' /> UnPublished
						</>
					)}
				</Badge>
			);
		},
	},
	{
		id: 'actions',
		cell: ({ row }) => <ActionCell id={row.original.id} />,
	},
];
