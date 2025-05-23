'use client';

import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Eye, EyeOff, Edit, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Badge from '@/components/Badge';
import { ChapterWithRelations } from '@/db/chapter';
import Link from 'next/link';
import { format } from 'date-fns';

export const columns: ColumnDef<ChapterWithRelations>[] = [
	{
		accessorKey: 'position',
		header: '#',
		cell: ({ row }) => (
			<div className='font-medium'>{row.getValue('position')}</div>
		),
	},
	{
		accessorKey: 'title',
		header: 'Title',
		cell: ({ row }) => {
			const chapter = row.original;
			return (
				<div>
					<div className='font-medium'>{chapter.title}</div>
					{chapter.description && (
						<div className='text-sm text-muted-foreground line-clamp-1'>
							{chapter.description}
						</div>
					)}
				</div>
			);
		},
	},
	{
		accessorKey: 'course',
		header: 'Course',
		cell: ({ row }) => {
			const course = row.getValue('course') as { title: string };
			return <div className='font-medium'>{course.title}</div>;
		},
	},
	{
		accessorKey: 'duration',
		header: 'Duration',
		cell: ({ row }) => {
			const duration = row.getValue('duration') as number | null;
			return duration ? `${duration} min` : '-';
		},
	},
	{
		accessorKey: 'accessType',
		header: 'Access',
		cell: ({ row }) => {
			const accessType = row.getValue('accessType') as string;
			return (
				<Badge variant={accessType === 'PRO' ? 'admin' : 'archive'}>
					{accessType}
				</Badge>
			);
		},
	},
	{
		accessorKey: 'published',
		header: 'Status',
		cell: ({ row }) => {
			const published = row.getValue('published') as boolean;
			return (
				<Badge variant={published ? 'admin' : 'archive'}>
					{published ? (
						<>
							<Eye className='w-3 h-3 mr-1' />
							Published
						</>
					) : (
						<>
							<EyeOff className='w-3 h-3 mr-1' />
							Draft
						</>
					)}
				</Badge>
			);
		},
	},
	{
		accessorKey: 'createdAt',
		header: 'Created',
		cell: ({ row }) => {
			const date = row.getValue('createdAt') as Date;
			return format(date, 'MMM dd, yyyy');
		},
	},
	{
		id: 'actions',
		header: 'Actions',
		cell: ({ row }) => {
			const chapter = row.original;

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant='ghost' className='h-8 w-8 p-0'>
							<span className='sr-only'>Open menu</span>
							<MoreHorizontal className='h-4 w-4' />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align='end'>
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem asChild>
							<Link href={`/user/lms/chapters/edit/${chapter.id}`}>
								<Edit className='mr-2 h-4 w-4' />
								Edit
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem className='text-destructive'>
							<Trash className='mr-2 h-4 w-4' />
							Delete
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
