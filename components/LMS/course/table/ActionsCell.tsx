'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { DeleteCourseButton } from './DeleteCourse';
import { CourseWithRelations } from '@/db/course';

interface ActionsCellProps {
	course: CourseWithRelations;
}

export function ActionsCell({ course }: ActionsCellProps) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
			<DropdownMenuTrigger asChild>
				<Button variant='ghost' className='h-8 w-8 p-0'>
					<span className='sr-only'>Open menu</span>
					<MoreHorizontal className='h-4 w-4' />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end'>
				{course.published && (
					<DropdownMenuItem asChild>
						<Link
							href={`/courses/${course.slug}`}
							className='flex items-center'
						>
							View Course
						</Link>
					</DropdownMenuItem>
				)}

				<DropdownMenuItem asChild>
					<Link
						href={`/user/lms/chapters?courseId=${course.id}`}
						className='flex items-center'
					>
						View Chapters ({course.chapters.length})
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem asChild>
					<Link
						href={`/user/lms/edit/${course.id}`}
						className='flex items-center'
					>
						Edit Course
					</Link>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					className='text-destructive focus:text-destructive'
					onSelect={(e) => e.preventDefault()}
				>
					<DeleteCourseButton id={course.id} />
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
