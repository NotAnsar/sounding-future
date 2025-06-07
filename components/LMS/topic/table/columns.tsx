'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import { convertDateFormat } from '@/lib/utils';
import { CourseTopic } from '@prisma/client';
import { EditTopicButton } from './topic-dialog';
import { DeleteTopicButton } from './delete-topic';

export const columns: ColumnDef<CourseTopic>[] = [
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
					Topic Name
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
		cell: ({ row }) => <EditTopicButton data={row.original} />,
	},
	{
		id: 'delete',
		cell: ({ row }) => <DeleteTopicButton id={row.original.id} />,
	},
];
