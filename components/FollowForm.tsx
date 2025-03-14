'use client';

import { toast } from '@/hooks/use-toast';
import { Icons } from '@/components/icons/track-icons';
import { useOptimistic } from 'react';
import { cn } from '@/lib/utils';
import { followArtist } from '@/actions/follow-artist';

export default function FollowForm({
	artistId,
	followed,
	className,
}: {
	className?: string;
	artistId: string;
	followed: boolean;
}) {
	const [optimisticFollow, setOptimisticFollow] = useOptimistic(
		followed,
		(_, newFollowed: boolean) => newFollowed
	);

	return (
		<form
			action={async () => {
				setOptimisticFollow(!optimisticFollow);
				const result = await followArtist(artistId);

				toast({
					description: result.message,
					variant: result.success ? 'default' : 'destructive',
					duration: 3000,
				});
			}}
			className={cn('cursor-pointer h-full flex justify-center items-center')}
		>
			<button type='submit'>
				{optimisticFollow ? (
					<Icons.unfollow
						className={cn(
							'min-w-7 w-7 sm:min-w-9 sm:w-9 h-auto aspect-square fill-grey flex-nowrap text-nowrap cursor-pointer transition-all duration-300',
							className
						)}
					/>
				) : (
					<Icons.follow
						className={cn(
							'min-w-7 w-7 sm:min-w-9 sm:w-9 h-auto aspect-square fill-grey flex-nowrap text-nowrap cursor-pointer transition-all duration-300',
							className
						)}
					/>
				)}
			</button>
		</form>
	);
}
