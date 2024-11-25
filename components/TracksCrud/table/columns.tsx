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
						href={`/tracks/${track.id}`}
						className={'text-base font-semibold line-clamp-1 hover:opacity-80'}
					>
						{track.title}
					</Link>
					<h6 className='text-sm font-light text-muted line-clamp-1 hidden sm:block'>
						{track.artist.name}
					</h6>
				</>
			);
		},
	},
	{
		accessorKey: 'curator',
		accessorFn: (row) => row.artist.name,
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
				<div>
					<h1 className='text-muted text-base font-semibold text-nowrap'>
						{partner?.name || null}
					</h1>
				</div>
			);
		},
	},
	{
		accessorKey: 'releaseYear',
		cell: ({ row }) => {
			return (
				<div className='text-sm text-nowrap'>
					{/* {convertDateFormat(new Date(row.getValue('createdAt')))} */}
					{row.getValue('releaseYear')}
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
					Release Year
					<ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
			);
		},
	},
	{
		accessorKey: '_count',
		cell: ({ row }) => {
			const { listeners } = row?.original?._count;
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
		accessorKey: '_count',
		cell: ({ row }) => {
			const { likes } = row?.original?._count;
			return (
				<div className='text-sm text-nowrap flex gap-1 items-center '>
					<Icons.liked className='w-4 h-auto aspect-square fill-muted' />
					<p>{likes}</p>
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
