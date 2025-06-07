'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import { convertDateFormat } from '@/lib/utils';
import { CourseSeries } from '@prisma/client';
import { EditSeriesButton } from './series-dialog';
import { DeleteSeriesButton } from './delete-series';

export const columns: ColumnDef<CourseSeries>[] = [
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
					Series Name
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
					Created At
					<ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
			);
		},
	},
	{
		id: 'edit',
		cell: ({ row }) => <EditSeriesButton data={row.original} />,
	},
	{
		id: 'delete',
		cell: ({ row }) => <DeleteSeriesButton id={row.original.id} />,
	},
];
