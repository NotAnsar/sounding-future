'use client';

import { useState } from 'react';
import { TrackWithCounts } from '@/db/tracks';
import { Icons } from '@/components/icons/track-icons';
import { Loader, User } from 'lucide-react';
import { getLikes, LikeWithUser } from '@/actions/upload-track/text-info';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { toast } from '@/hooks/use-toast';

export default function LikesPopUp({ track }: { track: TrackWithCounts }) {
	const [isLoading, setIsLoading] = useState(false);
	const [likesList, setLikesList] = useState<LikeWithUser[]>([]);
	const likesCount = track._count?.likes ?? 0;

	const handleOpenChange = async (open: boolean) => {
		if (open && likesCount > 0) {
			try {
				setIsLoading(true);
				const data = await getLikes(track.id);
				setLikesList(data);
			} catch (error) {
				toast({
					title: 'Failed to fetch likes',
					description: 'Please try again later',
				});
			} finally {
				setIsLoading(false);
			}
		}
	};

	const getUserName = (user: LikeWithUser['user']) => {
		return [user.f_name, user.l_name].filter(Boolean).join(' ') || user.name;
	};

	return (
		<Dialog onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>
				<Button
					variant='ghost'
					size='sm'
					className='text-sm text-nowrap flex gap-1 items-center h-auto px-2'
					disabled={likesCount === 0}
				>
					<Icons.liked className='w-4 h-auto aspect-square fill-muted' />
					<span>{likesCount}</span>
				</Button>
			</DialogTrigger>

			<DialogContent className='max-w-md h-[70vh] flex flex-col'>
				<DialogHeader className='pb-4'>
					<DialogTitle className='text-left'>Liked by</DialogTitle>
				</DialogHeader>

				<div className='flex-1 overflow-y-auto'>
					{isLoading ? (
						<div className='min-h-full flex items-center justify-center'>
							<Loader className='h-5 w-5 animate-spin' />
						</div>
					) : (
						<div className='space-y-4 pr-4'>
							{likesList.length === 0 ? (
								<p className='text-muted-foreground text-center'>
									No likes yet
								</p>
							) : (
								likesList.map(({ user }) => (
									<div
										key={user.id}
										className='flex items-center gap-4 p-2 hover:bg-accent rounded-lg'
									>
										{user.image ? (
											<Image
												src={user.image}
												alt={getUserName(user)}
												width={40}
												height={40}
												className='w-10 h-10 rounded-full object-cover'
											/>
										) : (
											<div className='w-10 h-10 rounded-full bg-muted flex items-center justify-center'>
												<User className='w-5 h-5 text-white' />
											</div>
										)}
										<div>
											<p className='font-medium'>{getUserName(user)}</p>
											{user.name && (
												<p className='text-sm text-muted-foreground'>
													@{user.name}
												</p>
											)}
										</div>
									</div>
								))
							)}
						</div>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
