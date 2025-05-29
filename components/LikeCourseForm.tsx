'use client';

import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Copy, Heart } from 'lucide-react';
import { useOptimistic } from 'react';
import { likeCourse } from '@/actions/lms/like-course';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Icons } from '@/components/icons/track-icons';

export default function LikeCourseForm({
	courseId,
	liked,
	className,
	likedClassname,
}: {
	className?: string;
	likedClassname?: string;
	courseId: string;
	liked: boolean;
}) {
	const [optimisticLiked, setOptimisticLiked] = useOptimistic(
		liked,
		(_, newLiked: boolean) => newLiked
	);

	return (
		<form
			action={async () => {
				setOptimisticLiked(!optimisticLiked);
				const result = await likeCourse(courseId);

				toast({
					description: result.message,
					variant: result.success ? 'default' : 'destructive',
					duration: 3000,
				});
			}}
			className='flex items-center justify-center'
		>
			<button type='submit'>
				<Heart
					className={cn(
						'w-5 h-auto text-muted hover:text-foreground cursor-pointer',
						className,
						optimisticLiked
							? cn('text-foreground fill-foreground', likedClassname)
							: ''
					)}
				/>
			</button>
		</form>
	);
}

export function ShareCourseButton({
	className,
	courseSlug,
	chapterSlug,
}: {
	className?: string;
	courseSlug: string;
	chapterSlug: string;
}) {
	const handleCopyLink = (url: string, description: string) => {
		navigator.clipboard.writeText(url);
		toast({
			description,
			duration: 2000,
		});
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					className={cn(
						'p-2 rounded-md hover:bg-accent transition-colors',
						className
					)}
				>
					<Icons.share className='w-5 h-5 fill-foreground hover:fill-foreground/80 transition-colors' />
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end' className='w-48'>
				<DropdownMenuItem
					onClick={() =>
						handleCopyLink(
							`${window.location.origin}/courses/${courseSlug}`,
							'Course link copied to clipboard'
						)
					}
					className='cursor-pointer gap-2'
				>
					<Copy className='w-4 h-4' />
					Copy course link
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					onClick={() =>
						handleCopyLink(
							`${window.location.origin}/courses/${courseSlug}?chapter=${chapterSlug}`,
							'Chapter link copied to clipboard'
						)
					}
					className='cursor-pointer gap-2'
				>
					<Copy className='w-4 h-4' />
					Copy chapter link
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
