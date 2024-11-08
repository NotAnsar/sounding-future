'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Button, buttonVariants } from '../../ui/button';
import { ArrowUpDown } from 'lucide-react';
import { Collection } from '@/config/dummy-data';
import Image from 'next/image';
import { Icons } from '@/components/icons/track-icons';
import { MainNavIcons } from '@/config/sidenav';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { DeletePartnerButton } from './DeletePartner';

export const columns: ColumnDef<Collection>[] = [
	{
		accessorKey: 'picture',
		header: '',
		cell: ({ row }) => {
			const collection = row.original;
			return (
				<div className='max-w-14'>
					<Image
						src={collection.picture}
						alt={collection.name}
						width={56}
						height={56}
						className='min-w-14 max-w-14 h-auto aspect-square object-cover border border-border rounded-md '
					/>
				</div>
			);
		},
	},
	{
		accessorKey: 'name',
		header: '',
		cell: ({ row }) => {
			return (
				<div className={'text-base font-semibold line-clamp-1'}>
					{row.getValue('name')}
				</div>
			);
		},
	},
	{
		accessorKey: 'tracks',
		cell: ({ row }) => {
			return (
				<div className='text-sm text-nowrap flex gap-1 items-center '>
					<MainNavIcons.tracks className='w-4 h-auto aspect-square fill-muted text-muted' />
					<p>{row.getValue('tracks')}</p>
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
			return (
				<div className='text-sm text-nowrap flex gap-1 items-center'>
					<Icons.played className='w-4 h-auto aspect-square fill-muted text-muted' />
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
		id: 'edit',
		cell: ({ row }) => (
			<Link
				href={`/user/curated/edit/${row.original.id}`}
				className={cn(buttonVariants({ variant: 'ghost' }))}
			>
				<Icons.edit className='w-5 h-auto aspect-square fill-muted text-muted' />
			</Link>
		),
	},
	{
		id: 'delete',
		cell: ({ row }) => <DeletePartnerButton id={row.original.id} />,
	},
];
