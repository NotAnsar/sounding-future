'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '../../../ui/button';
import { ArrowUpDown } from 'lucide-react';
import { convertDateFormat } from '@/lib/utils';
import { EditGenreButton } from './genre-dialog';
import { Genre } from '@prisma/client';
import { DeleteGenreButton } from './delete-genre';

export const columns: ColumnDef<Genre>[] = [
	{
		accessorKey: 'name',
		cell: ({ row }) => {
			return (
				<div className='text-[15px] text-nowrap'>{row.getValue('name')}</div>
			);
		},
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					className='hover:bg-transparent hover:text-foreground px-0'
				>
					Genre Name
					<ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
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
		cell: ({ row }) => <EditGenreButton data={row.original} />,
	},
	{
		id: 'delete',
		cell: ({ row }) => <DeleteGenreButton id={row.original.id} />,
	},
];
