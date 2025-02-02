'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Button, buttonVariants } from '../../ui/button';
import { ArrowUpDown, Shield, ShieldCheck, UserIcon } from 'lucide-react';
import Image from 'next/image';
import { Icons } from '@/components/icons/track-icons';
import Link from 'next/link';
import { cn, formatTimestamp } from '@/lib/utils';
import { DeleteUserButton } from './DeleteUser';
import { UserStats } from '@/db/user';
import Badge from '@/components/Badge';

export const columns: ColumnDef<UserStats>[] = [
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
			return (
				<div className={'text-sm font-semibold line-clamp-1'}>
					{row.getValue('name')}
				</div>
			);
		},
	},
	{
		accessorKey: 'f_name',
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					className='hover:bg-transparent hover:text-foreground px-0'
				>
					Full Name
					<ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
			);
		},
		cell: ({ row }) => {
			const { f_name, l_name } = row.original;
			return (
				<div className={'text-sm font-semibold line-clamp-1'}>
					{f_name} {l_name}
				</div>
			);
		},
	},
	{
		accessorKey: 'email',
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					className='hover:bg-transparent hover:text-foreground px-0'
				>
					Email
					<ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
			);
		},
		cell: ({ row }) => {
			return (
				<div className={'text-sm line-clamp-1'}>{row.getValue('email')}</div>
			);
		},
	},
	{
		accessorKey: 'role',
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					className='hover:bg-transparent hover:text-foreground px-0'
				>
					Role
					<ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
			);
		},
		cell: ({ row }) => {
			const role = row.getValue('role');
			return (
				<Badge variant={role === 'admin' ? 'admin' : 'archive'}>
					{role === 'admin' ? (
						<>
							<ShieldCheck className='w-3 h-auto' /> Admin
						</>
					) : (
						<>
							<Shield className='w-3 h-auto' /> User
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
		accessorKey: 'lastLoginAt',
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					className='hover:bg-transparent hover:text-foreground px-0'
				>
					Last Login
					<ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
			);
		},
		cell: ({ row }) => {
			const lastLogin = row.getValue('lastLoginAt') as string | null;
			return (
				<div className='text-sm text-nowrap'>
					{lastLogin ? formatTimestamp(lastLogin, true) : null}
				</div>
			);
		},
	},
	{
		id: 'edit',
		cell: ({ row }) => (
			<Link
				href={`/user/users/edit/${row.original.id}`}
				className={cn(buttonVariants({ variant: 'ghost' }))}
			>
				<Icons.edit className='w-5 h-auto aspect-square fill-muted text-muted' />
			</Link>
		),
	},
	{
		id: 'delete',
		cell: ({ row }) => <DeleteUserButton id={row.original.id} />,
	},
];
