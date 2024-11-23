'use client';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
	AudioLines,
	Handshake,
	MicVocal,
	Newspaper,
	Tags,
	UserIcon,
	UserRoundCog,
} from 'lucide-react';
import Link from 'next/link';
import { AvatarImage } from '@radix-ui/react-avatar';
import { cn } from '@/lib/utils';
import LogOutButton from './LogOutButton';
import { User } from 'next-auth';

export default function UserNav({
	className,
	user,
}: {
	className?: string;
	user: User;
}) {
	const isAdmin = user.role === 'admin';
	return (
		<DropdownMenu>
			<DropdownMenuTrigger className={cn('relative', className)}>
				<Avatar className='flex items-center justify-center'>
					<AvatarImage
						className='h-9 w-auto aspect-square rounded-full object-cover'
						src={user?.image || undefined}
					/>

					<AvatarFallback className='h-9 w-auto aspect-square bg-button'>
						<span className='sr-only'>{user?.email}</span>
						<UserIcon className='h-[17px] w-auto text-white' />
					</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>

			<DropdownMenuContent
				align='end'
				// className='max-w-[250px] min-w-[200px] bg-background backdrop-blur-md border-border '
				className='max-w-[250px] min-w-[200px] bg-background backdrop-blur-md border-border '
			>
				<div className='flex items-center p-1.5'>
					<Avatar className='flex items-center justify-center'>
						<AvatarImage
							className='h-9 w-auto aspect-square rounded-full object-cover'
							src={user?.image || undefined}
						/>

						<AvatarFallback className='h-9 w-auto aspect-square bg-button'>
							<span className='sr-only'>{user?.email}</span>
							<UserIcon className='h-[17px] w-auto text-white' />
						</AvatarFallback>
					</Avatar>
					<div className='flex items-center justify-start gap-2 p-2'>
						<div className='flex flex-col space-y-1 leading-none '>
							<p className='font-medium text-[15px] line-clamp-1'>
								{user.name}
							</p>

							<p className='w-[200px] text-[13px] text-muted-foreground line-clamp-1'>
								{user?.email}
							</p>
						</div>
					</div>
				</div>

				<DropdownMenuSeparator />

				<DropdownMenuItem className='cursor-pointer p-0' asChild>
					<Link
						href={'/user/settings'}
						className='px-2 py-2.5 w-full flex items-center'
					>
						<UserRoundCog className='w-4 h-auto mr-2' />
						Account Settings
					</Link>
				</DropdownMenuItem>

				<DropdownMenuItem className='cursor-pointer p-0 ' asChild>
					<Link
						href={'/user/profile'}
						className='px-2 py-2.5 w-full flex items-center '
					>
						<MicVocal className='w-4 h-auto mr-2' />
						Artist Profile
					</Link>
				</DropdownMenuItem>

				{isAdmin ? <DropdownMenuSeparator /> : null}
				<DropdownMenuItem className='cursor-pointer p-0' asChild>
					<Link
						href={'/user/tracks'}
						className='px-2 py-2.5 w-full flex items-center'
					>
						<AudioLines className='w-4 h-auto mr-2 ' />
						{`${isAdmin ? '' : 'My '}Tracks`}
					</Link>
				</DropdownMenuItem>

				{isAdmin ? (
					<>
						<DropdownMenuItem className='cursor-pointer p-0' asChild>
							<Link
								href={'/user/curated'}
								className='px-2 py-2.5 w-full flex items-center'
							>
								<Handshake className='w-4 h-auto mr-2 ' />
								Curating Partners
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem className='cursor-pointer p-0' asChild>
							<Link
								href={'/user/tags'}
								className='px-2 py-2.5 w-full flex items-center'
							>
								<Tags className='w-4 h-auto mr-2 ' />
								Tags Management
							</Link>
						</DropdownMenuItem>
					</>
				) : null}

				<DropdownMenuSeparator />

				<DropdownMenuItem className='cursor-pointer p-0' asChild>
					<Link
						href={'https://www.soundingfuture.com/en'}
						target='_blank'
						className='px-2 py-2.5 w-full flex items-center'
					>
						<Newspaper className='w-4 h-auto mr-2 ' />
						Switch to articles
					</Link>
				</DropdownMenuItem>

				<DropdownMenuSeparator />
				<DropdownMenuItem className='cursor-pointer p-0 '>
					<LogOutButton />
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
