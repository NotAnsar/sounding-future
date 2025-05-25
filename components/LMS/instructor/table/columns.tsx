'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Shield, ShieldCheck, BookOpen } from 'lucide-react';
import Image from 'next/image';
import Badge from '@/components/Badge';
import { InstructorStats } from '@/db/instructor';
import { Button, buttonVariants } from '@/components/ui/button';
import InstructorCoursesPopUp from './InstructorCoursesPopUp';
import Link from 'next/link';
import { cn, convertDateFormat } from '@/lib/utils';
import { Icons } from '@/components/icons/track-icons';
import { DeleteInstructorButton } from './DeleteInstructor';

export const columns: ColumnDef<InstructorStats>[] = [
	{
		accessorKey: 'image',
		header: '',
		cell: ({ row }) => {
			const instructor = row.original;
			return (
				<div className='max-w-14'>
					{instructor?.image ? (
						<Image
							src={instructor.image}
							alt={instructor.name}
							width={56}
							height={56}
							className='min-w-14 max-w-14 h-auto aspect-square object-cover border border-border rounded-md'
						/>
					) : (
						<div className='min-w-14 max-w-14 h-auto aspect-square object-cover border border-border rounded-md bg-muted flex items-center justify-center'>
							<BookOpen className='w-6 h-6 text-muted-foreground' />
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
					Name
					<ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
			);
		},
		cell: ({ row }) => {
			const instructor = row.original;
			return (
				<div>
					<p className={'text-base font-semibold line-clamp-1'}>
						{instructor.name}
					</p>
				</div>
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
			const bio = row.getValue('bio') as string;
			return (
				<div className={'text-sm max-w-60 line-clamp-2'}>
					{bio || 'No bio available'}
				</div>
			);
		},
	},
	{
		accessorKey: '_count',
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					className='hover:bg-transparent hover:text-foreground px-0'
				>
					Courses
					<ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
			);
		},
		cell: ({ row }) => {
			const instructor = row.original;
			const coursesCount = instructor._count?.courses ?? 0;
			const chaptersCount = instructor._count?.chapters ?? 0;

			return (
				<InstructorCoursesPopUp
					instructorId={instructor.id}
					coursesCount={coursesCount}
					chaptersCount={chaptersCount}
				/>
			);
		},
		sortingFn: (rowA, rowB) => {
			const totalA =
				(rowA.original._count?.courses ?? 0) +
				(rowA.original._count?.chapters ?? 0);
			const totalB =
				(rowB.original._count?.courses ?? 0) +
				(rowB.original._count?.chapters ?? 0);
			return totalA - totalB;
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
							<Shield className='w-3 h-auto' /> Unpublished
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
			const date = new Date(row.getValue('createdAt'));
			return <div className='text-sm'>{convertDateFormat(date)}</div>;
		},
	},
	{
		id: 'edit',
		cell: ({ row }) => (
			<Link
				href={`/user/lms/instructors/${row.original.id}`}
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
