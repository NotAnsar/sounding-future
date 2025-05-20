'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Button, buttonVariants } from '@/components/ui/button';
import { ArrowUpDown, Shield, ShieldCheck, UserIcon } from 'lucide-react';
import Image from 'next/image';
import { Icons } from '@/components/icons/track-icons';
import Link from 'next/link';
import { cn, formatTimestamp } from '@/lib/utils';
import Badge from '@/components/Badge';
import { DeleteInstructorButton } from './DeleteInstructor';
import { InstructorWithArtist } from '@/db/instructor';

export const columns: ColumnDef<InstructorWithArtist>[] = [
	{
		accessorKey: 'image',
		header: '',
		cell: ({ row }) => {
			const user = row.original;
			return (
				<div className='max-w-14'>
					{user?.image ? (
						<Image
							src={user?.image}
							alt={user.name}
							width={56}
							height={56}
							className='min-w-14 max-w-14 h-auto aspect-square object-cover border border-border rounded-full '
						/>
					) : (
						<div className='min-w-14 max-w-14 h-auto aspect-square object-cover border border-border rounded-full bg-muted flex items-center justify-center'>
							<UserIcon className='w-6 h-6 mx-auto my-auto text-white' />
						</div>
					)}
				</div>
			);
		},
	},
	{
		accessorKey: 'name',
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					className='hover:bg-transparent hover:text-foreground px-0'
				>
					Username
					<ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
			);
		},
		cell: ({ row }) => {
			const { name } = row.original;
			return <p className={'text-base font-semibold line-clamp-1'}>{name}</p>;
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
		accessorKey: 'artist',
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
			const artist = row.original.artist;

			if (!artist) {
				return (
					<div className='text-muted-foreground text-sm'>No artist linked</div>
				);
			}

			return (
				<div className='flex items-center gap-2'>
					<span className='font-medium'>{artist.name}</span>
				</div>
			);
		},
		sortingFn: (rowA, rowB) => {
			const artistA = rowA.original.artist?.name || '';
			const artistB = rowB.original.artist?.name || '';
			return artistA.localeCompare(artistB);
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
		accessorKey: 'createdAt',
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					className='hover:bg-transparent hover:text-foreground px-0'
				>
					Date Joined
					<ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
			);
		},
		cell: ({ row }) => {
			return (
				<div className='text-sm text-nowrap'>
					{formatTimestamp(row.getValue('createdAt'))}
				</div>
			);
		},
	},

	{
		id: 'edit',
		cell: ({ row }) => (
			<Link
				href={`/user/lms/intructors/${row.original.id}`}
				className={cn(buttonVariants({ variant: 'ghost' }))}
			>
				<Icons.edit className='w-5 h-auto aspect-square fill-muted text-muted' />
			</Link>
		),
	},
	{
		id: 'delete',
		cell: ({ row }) => <DeleteInstructorButton id={row.original.id} />,
	},
];
