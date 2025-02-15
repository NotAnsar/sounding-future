// 'use client';

// import { useState } from 'react';
// import { Icons } from '@/components/icons/track-icons';
// import { Eye, Loader, User } from 'lucide-react';
// import { getArtistLikes, ArtistLikeWithUser } from '@/actions/like-track';
// import {
// 	Dialog,
// 	DialogContent,
// 	DialogHeader,
// 	DialogTitle,
// 	DialogTrigger,
// } from '@/components/ui/dialog';
// import { Button, buttonVariants } from '@/components/ui/button';
// import Image from 'next/image';
// import { toast } from '@/hooks/use-toast';
// import Link from 'next/link';
// import { cn } from '@/lib/utils';
// import { ArtistStats } from '@/db/artist';

// export default function ArtistLikesPopUp({ artist }: { artist: ArtistStats }) {
// 	const [isLoading, setIsLoading] = useState(false);
// 	const [likesList, setLikesList] = useState<ArtistLikeWithUser[]>([]);
// 	const likesCount = artist?.liked ?? 0;

// 	const handleOpenChange = async (open: boolean) => {
// 		if (open && likesCount > 0) {
// 			try {
// 				setIsLoading(true);
// 				const data = await getArtistLikes(artist.id);
// 				setLikesList(data);
// 			} catch (error) {
// 				toast({
// 					title: 'Failed to fetch likes',
// 					description: 'Please try again later',
// 				});
// 			} finally {
// 				setIsLoading(false);
// 			}
// 		}
// 	};

// 	const getUserName = (user: ArtistLikeWithUser['user']) => {
// 		return [user.f_name, user.l_name].filter(Boolean).join(' ') || user.name;
// 	};

// 	return (
// 		<Dialog onOpenChange={handleOpenChange}>
// 			<DialogTrigger asChild>
// 				<Button
// 					variant='ghost'
// 					size='sm'
// 					className='text-sm text-nowrap flex gap-1 items-center h-auto px-2 bg-link hover:bg-link/80 text-black hover:text-black'
// 					disabled={likesCount === 0}
// 				>
// 					<Icons.liked className='w-4 h-auto aspect-square fill-black' />
// 					<span>{likesCount}</span>
// 				</Button>
// 			</DialogTrigger>

// 			<DialogContent className='max-w-md h-[70vh] flex flex-col'>
// 				<DialogHeader className='pb-4'>
// 					<DialogTitle className='text-left'>Liked by</DialogTitle>
// 				</DialogHeader>

// 				<div className='flex-1 overflow-y-auto'>
// 					{isLoading ? (
// 						<div className='min-h-full flex items-center justify-center'>
// 							<Loader className='h-5 w-5 animate-spin' />
// 						</div>
// 					) : (
// 						<div className='space-y-4 pr-4'>
// 							{likesList.length === 0 ? (
// 								<p className='text-muted-foreground text-center'>
// 									No likes yet
// 								</p>
// 							) : (
// 								likesList.map(({ user, tracks }) => (
// 									<div
// 										key={user.id}
// 										className='flex items-center gap-4 p-2 hover:bg-accent rounded-lg justify-between'
// 									>
// 										<div className='flex gap-2 items-center'>
// 											{user.image ? (
// 												<Image
// 													src={user.image}
// 													alt={getUserName(user)}
// 													width={40}
// 													height={40}
// 													className='w-10 h-10 rounded-full object-cover'
// 												/>
// 											) : (
// 												<div className='w-10 h-10 rounded-full bg-muted flex items-center justify-center'>
// 													<User className='w-5 h-5 text-white' />
// 												</div>
// 											)}
// 											<div>
// 												<p className='font-medium'>{getUserName(user)}</p>
// 												{tracks.map(({ title }) => (
// 													<p className='text-sm text-muted' key={title}>
// 														{title}
// 													</p>
// 												))}
// 											</div>
// 										</div>
// 										{user.artist?.slug && (
// 											<Link
// 												href={`/artists/${user.artist?.slug}`}
// 												className={cn(buttonVariants({ size: 'sm' }))}
// 											>
// 												<Eye className='w-4 h-auto aspect-square flex-nowrap text-nowrap cursor-pointer' />
// 											</Link>
// 										)}
// 									</div>
// 								))
// 							)}
// 						</div>
// 					)}
// 				</div>
// 			</DialogContent>
// 		</Dialog>
// 	);
// }
import { useState } from 'react';
import { Icons } from '@/components/icons/track-icons';
import {
	ChevronDown,
	ChevronRight,
	Eye,
	Loader,
	User,
	Music,
} from 'lucide-react';
import { getArtistLikes, ArtistLikeWithUser } from '@/actions/like-track';
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
import { ArtistStats } from '@/db/artist';

function UserLikeCard({ user, tracks }: ArtistLikeWithUser) {
	const [isExpanded, setIsExpanded] = useState(false);

	const getUserName = (user: ArtistLikeWithUser['user']) => {
		return [user.f_name, user.l_name].filter(Boolean).join(' ') || user.name;
	};

	return (
		<div className='border rounded-lg overflow-hidden'>
			<div
				className='flex items-center gap-4 p-3 bg-accent/20 justify-between cursor-pointer hover:bg-accent/30 transition-colors'
				onClick={() => setIsExpanded(!isExpanded)}
			>
				<div className='flex items-center gap-3 flex-1'>
					<div className='flex items-center gap-3'>
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
							<p className='text-sm text-muted-foreground'>
								{tracks.length} {tracks.length === 1 ? 'track' : 'tracks'}
							</p>
						</div>
					</div>
				</div>

				<div className='flex items-center gap-2'>
					{user.artist?.slug && (
						<Link
							href={`/artists/${user.artist?.slug}`}
							className={cn(buttonVariants({ size: 'sm' }))}
							onClick={(e) => e.stopPropagation()}
						>
							<Eye className='w-4 h-4' />
						</Link>
					)}
					{isExpanded ? (
						<ChevronDown className='w-5 h-5 text-muted-foreground' />
					) : (
						<ChevronRight className='w-5 h-5 text-muted-foreground' />
					)}
				</div>
			</div>

			{isExpanded && (
				<div className='border-t divide-y'>
					{tracks.map((track, index) => (
						<div
							key={index}
							className='flex items-center gap-3 p-2 pl-4 hover:bg-accent/10 transition-colors'
						>
							<Music className='w-4 h-4 text-muted-foreground' />
							<Link
								href={`/tracks/${track.slug}`}
								className='text-sm hover:underline truncate'
							>
								{track.title}
							</Link>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

export default function ArtistLikesPopUp({ artist }: { artist: ArtistStats }) {
	const [isLoading, setIsLoading] = useState(false);
	const [likesList, setLikesList] = useState<ArtistLikeWithUser[]>([]);
	const likesCount = artist?.liked ?? 0;

	const handleOpenChange = async (open: boolean) => {
		if (open && likesCount > 0) {
			try {
				setIsLoading(true);
				const data = await getArtistLikes(artist.id);
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

	return (
		<Dialog onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>
				<Button
					size='sm'
					className='text-sm text-nowrap flex gap-1 items-center h-auto px-2 text-white hover:text-white'
					disabled={likesCount === 0}
				>
					<Icons.liked className='w-4 h-auto aspect-square fill-white' />
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
						<div className='space-y-3 pr-4'>
							{likesList?.length === 0 ? (
								<p className='text-muted-foreground text-center'>
									No likes yet
								</p>
							) : (
								likesList.map((userLike) => (
									<UserLikeCard key={userLike.user.id} {...userLike} />
								))
							)}
						</div>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
