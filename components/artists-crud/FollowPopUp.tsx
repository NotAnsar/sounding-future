'use client';

import { useState } from 'react';
import { CircleUser, Eye, Loader, User } from 'lucide-react';
import { FollowWithUser, getFollowers } from '@/actions/like-track';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Button, buttonVariants } from '@/components/ui/button';
import Image from 'next/image';
import { toast } from '@/hooks/use-toast';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function FollowPopUp({
	isAdmin = true,
	followers: followersCount,
	id,
}: {
	id: string;
	followers: number;
	isAdmin?: boolean;
}) {
	const [isLoading, setIsLoading] = useState(false);
	const [followerList, setFollowerList] = useState<FollowWithUser[]>([]);

	const handleOpenChange = async (open: boolean) => {
		if (open && followersCount > 0) {
			try {
				setIsLoading(true);
				const data = await getFollowers(id);
				setFollowerList(data);
			} catch (error) {
				toast({
					title: 'Failed to fetch followers',
					description: 'Please try again later',
				});
			} finally {
				setIsLoading(false);
			}
		}
	};

	const getUserName = (user: FollowWithUser['user']) => {
		return [user.f_name, user.l_name].filter(Boolean).join(' ') || user.name;
	};

	return (
		<Dialog onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>
				{isAdmin ? (
					<Button
						size='sm'
						className='text-sm text-nowrap flex gap-1 items-center h-auto px-2 text-white hover:text-white'
						disabled={followersCount === 0}
					>
						<CircleUser className='w-4 h-4 ' />
						<span>{followersCount}</span>
					</Button>
				) : (
					<Button
						className='text-sm text-nowrap flex gap-1 items-center h-auto px-3 text-white hover:text-white'
						disabled={followersCount === 0}
					>
						View Followers
					</Button>
				)}
			</DialogTrigger>

			<DialogContent className='max-w-md h-[70vh] flex flex-col p-0 '>
				<DialogHeader className='pb-4 border-b p-4'>
					<DialogTitle className='text-left'>
						{isLoading ? followersCount : followerList.length} Followers
					</DialogTitle>
				</DialogHeader>

				<div className='flex-1 overflow-y-auto px-3'>
					{isLoading ? (
						<div className='min-h-full flex items-center justify-center'>
							<Loader className='h-5 w-5 animate-spin' />
						</div>
					) : (
						<div className='space-y-4 '>
							{followerList?.length === 0 ? (
								<p className='text-muted-foreground text-center'>
									No followers yet
								</p>
							) : (
								followerList.map(({ user }) => (
									<div
										key={user.id}
										className='flex items-center gap-4 p-2 hover:bg-accent rounded-lg justify-between'
									>
										<div className='flex gap-2 items-center'>
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
											</div>
										</div>
										{user.artist?.slug && user.artist.published && (
											<Link
												href={`/artists/${user.artist?.slug}`}
												className={cn(buttonVariants({ size: 'sm' }))}
											>
												<Eye className='w-4 h-auto aspect-square flex-nowrap text-nowrap cursor-pointer' />
											</Link>
										)}
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
