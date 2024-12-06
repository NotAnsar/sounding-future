import { likeTrack } from '@/actions/like-track';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Heart } from 'lucide-react';
import { useOptimistic } from 'react';

export default function LikeForm({
	trackId,
	liked,
	className,
}: {
	className?: string;
	trackId: string;
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
				const result = await likeTrack(trackId);

				toast({
					description: result.message,
					variant: result.success ? 'default' : 'destructive',
					duration: 3000,
				});
			}}
		>
			<button type='submit'>
				<Heart
					className={cn(
						'w-5 h-auto text-muted hover:text-white cursor-pointer',
						className,
						optimisticLiked ? 'text-white fill-white' : ''
					)}
				/>
			</button>
		</form>
	);
}
