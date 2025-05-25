'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, BookOpen, Shield, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import { formatTimestamp } from '@/lib/utils';
import Badge from '@/components/Badge';
import { CourseWithRelations } from '@/db/course';
import { ActionsCell } from './ActionsCell';
import Link from 'next/link';

export const columns: ColumnDef<CourseWithRelations>[] = [
	{
		accessorKey: 'thumbnail',
		header: '',
		cell: ({ row }) => {
			const course = row.original;
			return (
				<div className='max-w-14'>
					{course?.thumbnail ? (
						<Image
							src={course.thumbnail}
							alt={course.title}
							width={56}
							height={56}
							className='min-w-14 max-w-14 h-auto aspect-square object-cover border border-border rounded-md'
						/>
					) : (
						<div className='min-w-14 max-w-14 h-auto aspect-video object-cover border border-border rounded-md bg-muted flex items-center justify-center'>
							<BookOpen className='w-6 h-6 mx-auto my-auto text-white' />
						</div>
					)}
				</div>
			);
		},
	},
	{
		accessorKey: 'title',
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					className='hover:bg-transparent hover:text-foreground px-0'
				>
					Title
					<ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
			);
		},
		cell: ({ row }) => {
			const { title } = row.original;
			return <p className={'text-base font-semibold line-clamp-1'}>{title}</p>;
		},
	},
	{
		accessorKey: 'level',
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					className='hover:bg-transparent hover:text-foreground px-0'
				>
					Level
					<ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
			);
		},
		cell: ({ row }) => {
			const level = row.getValue('level') as string;
			return <Badge variant='admin'>{level}</Badge>;
		},
	},

	{
		accessorKey: 'instructors',
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					className='hover:bg-transparent hover:text-foreground px-0'
				>
					Instructors
					<ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
			);
		},
		cell: ({ row }) => {
			const instructors = row.original.instructors;
			if (!instructors || instructors.length === 0) {
				return <p className={'text-muted-foreground text-[15px]'}>N/A</p>;
			}

			const primaryInstructor =
				instructors.find((rel) => rel.isPrimary)?.instructor ||
				instructors[0]?.instructor;
			const additionalCount = instructors.length - 1;

			return (
				<div className={'font-semibold line-clamp-1 text-[15px]'}>
					<Link
						href={`/user/lms/instructors/${primaryInstructor?.id}`}
						className='cursor-pointer'
					>
						{primaryInstructor?.name}
					</Link>

					{additionalCount > 0 && (
						<span className='text-muted-foreground text-sm'>
							{' '}
							+{additionalCount} more
						</span>
					)}
				</div>
			);
		},
	},
	{
		accessorKey: 'accessType',
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					className='hover:bg-transparent hover:text-foreground px-0'
				>
					Access
					<ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
			);
		},
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
		header: () => <div className='text-nowrap text-sm'>Status</div>,
		cell: ({ row }) => {
			const published = row.getValue('published');

			return (
				<Badge variant={published ? 'success' : 'archive'}>
					{published ? (
						<>
							<ShieldCheck className='w-3 h-auto mr-1' /> Published
						</>
					) : (
						<>
							<Shield className='w-3 h-auto mr-1' /> Draft
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
					Created
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
		id: 'chapters',
		header: () => <div className='text-nowrap text-sm'>Chapters</div>,
		cell: ({ row }) => {
			const chapters = row.original.chapters;
			return <div className='text-sm text-nowrap'>{chapters.length}</div>;
		},
	},

	{
		id: 'actions',
		header: () => <div className='text-center'>Actions</div>,
		cell: ({ row }) => (
			<ActionsCell
				courseId={row.original.id}
				chapterCount={row.original.chapters.length}
			/>
		),
	},
];
