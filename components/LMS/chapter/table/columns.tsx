'use client';

import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Eye, EyeOff, Video, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Badge from '@/components/Badge';
import { ChapterWithRelations } from '@/db/chapter';
import Link from 'next/link';
import { format } from 'date-fns';
import { DeleteChapterButton } from './../DeleteChapterButton';

export const columns: ColumnDef<ChapterWithRelations>[] = [
	{
		accessorKey: 'title',
		header: 'Title',
		cell: ({ row }) => {
			const chapter = row.original;
			return (
				<div>
					<div className='font-medium flex items-center gap-2'>
						{chapter.title}
						{chapter.videoUrl && (
							<Video className='w-3 h-3 text-muted-foreground' />
						)}
						{chapter.thumbnail && (
							<ImageIcon className='w-3 h-3 text-muted-foreground aspect-square' />
						)}
					</div>
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
		accessorKey: 'instructors',
		header: 'Instructors',
		cell: ({ row }) => {
			const instructors = row.original.instructors;
			if (!instructors || instructors.length === 0) {
				return <span className='text-muted-foreground'>No instructors</span>;
			}

			const instructorNames = instructors.map((rel) => rel.instructor.name);

			if (instructorNames.length === 1) {
				return (
					<Link
						href={`/user/lms/instructors/${instructors[0].instructor.id}`}
						className='font-medium text-sm cursor-pointer'
					>
						{instructorNames[0]}
					</Link>
				);
			}

			return (
				<div className='text-sm'>
					<Link
						href={`/user/lms/instructors/${instructors[0].instructor.id}`}
						className='font-medium cursor-pointer'
					>
						{instructorNames[0]}
					</Link>
					{instructorNames.length > 1 && (
						<div className='text-xs text-muted-foreground'>
							+{instructorNames.length - 1} more
						</div>
					)}
				</div>
			);
		},
	},
	{
		accessorKey: 'videoDuration',
		header: 'Duration',
		cell: ({ row }) => {
			const duration = row.getValue('videoDuration') as number | null;
			if (!duration) return '-';

			const minutes = Math.floor(duration / 60);
			const seconds = duration % 60;
			return `${minutes}:${seconds.toString().padStart(2, '0')}`;
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
				<Badge variant={published ? 'success' : 'archive'}>
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
						<DropdownMenuItem asChild>
							<Link href={`/user/lms/chapters/edit/${chapter.id}`}>
								Edit chapter
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem
							className='text-destructive focus:text-destructive'
							onSelect={(e) => e.preventDefault()}
						>
							<DeleteChapterButton
								id={chapter.id}
								title={chapter.title}
								courseName={chapter.course.title}
							/>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
