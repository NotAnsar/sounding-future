'use client';

import { ColumnDef } from '@tanstack/react-table';

import { ArrowUpDown, Shield, ShieldCheck } from 'lucide-react';
import ActionCell from './ActionCell';
import Image from 'next/image';
import Badge from '@/components/Badge';
import { ArtistStats } from '@/db/artist';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons/track-icons';
import ArtistLikesPopUp from '../ArtistLikePopUp';
import FollowPopUp from '../FollowPopUp';

export const columns: ColumnDef<ArtistStats>[] = [
	{
		accessorKey: 'pic',
		header: '',
		cell: ({ row }) => {
			const partner = row.original;
			return (
				<div className='max-w-14'>
					{partner?.pic ? (
						<Image
							src={partner?.pic}
							alt={partner.name}
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
		accessorKey: 'name',
		header: '',
		cell: ({ row }) => {
			return (
				<p className={'text-base font-semibold line-clamp-1'}>
					{row.getValue('name')}
				</p>
			);
		},
	},
	{
		accessorKey: 'bio',
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					className='hover:bg-transparent hover:text-foreground px-0'
				>
					Bio
					<ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
			);
		},
		cell: ({ row }) => {
			return (
				<div className={'text-base font-semibold max-w-60 line-clamp-1'}>
					{row.getValue('bio')}
				</div>
			);
		},
	},

	{
		accessorKey: '_count.tracks',
		cell: ({ row }) => {
			const tracks = row.original._count?.tracks ?? 0;
			return (
				<div className='text-sm text-nowrap flex gap-1 items-center'>
					<Icons.played className='w-4 h-auto aspect-square fill-muted' />
					<p>{tracks}</p>
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
					Tracks
					<ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
			);
		},
	},

	{
		accessorKey: 'played',
		cell: ({ row }) => {
			const played = row.original.played ?? 0;
			return (
				<div className='text-sm text-nowrap flex gap-1 items-center'>
					<Icons.played className='w-4 h-auto aspect-square fill-muted' />
					<p>{played}</p>
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
		accessorKey: '_count.followers',
		cell: ({ row }) => (
			<FollowPopUp
				id={row.original.id}
				followers={row.original._count?.followers ?? 0}
			/>
		),

		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					className='hover:bg-transparent hover:text-foreground px-0'
				>
					Followers
					<ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
			);
		},
	},
	{
		accessorKey: 'liked',
		cell: ({ row }) => <ArtistLikesPopUp artist={row.original} />,
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
