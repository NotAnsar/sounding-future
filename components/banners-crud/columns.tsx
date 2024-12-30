'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Shield, ShieldCheck } from 'lucide-react';
import { cn, convertDateFormat } from '@/lib/utils';
import { Banner } from '@prisma/client';
import { Button, buttonVariants } from '../ui/button';
import Badge from '../Badge';
import { Icons } from '@/components/icons/track-icons';
import Link from 'next/link';
import { DeleteBannerButton } from './delete-banner';

export const columns: ColumnDef<Banner>[] = [
	{
		accessorKey: 'title',
		cell: ({ row }) => {
			return (
				<div className='text-[15px] text-nowrap'>{row.getValue('title')}</div>
			);
		},
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					className='hover:bg-transparent hover:text-foreground px-0'
				>
					Banner Title
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
		accessorKey: 'createdAt',
		cell: ({ row }) => {
			return (
				<div className='text-[15px] text-nowrap'>
					{convertDateFormat(new Date(row.getValue('createdAt')))}
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
		id: 'edit',
		cell: ({ row }) => (
			<Link
				className={cn(buttonVariants({ variant: 'ghost' }))}
				href={`/user/banners/edit/${row.original.id}`}
			>
				<Icons.edit className='w-5 h-auto aspect-square fill-muted text-muted' />
			</Link>
		),
	},
	{
		id: 'delete',
		cell: ({ row }) => <DeleteBannerButton id={row.original.id} />,
	},
];