'use client';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Settings, Upload, UserIcon, UserRoundCog } from 'lucide-react';
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
	return (
		<DropdownMenu>
			<DropdownMenuTrigger className={cn('relative', className)}>
				<Avatar className='flex items-center justify-center'>
					<AvatarImage
						className='h-9 w-auto aspect-square rounded-full'
						src={user?.image || undefined}
					/>

					<AvatarFallback className='h-9 w-auto aspect-square bg-button'>
						<span className='sr-only'>{user?.email}</span>
						<UserIcon className='h-[17px] w-auto' />
					</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>

			<DropdownMenuContent
				align='end'
				className='max-w-[250px] min-w-[200px] truncate bg-foreground backdrop-blur-md border-background '
			>
				<div className='flex items-center justify-start gap-2 p-2'>
					<div className='flex flex-col space-y-1 leading-none truncate'>
						<p className='font-medium text-[15px] truncate'>{user.name}</p>

						<p className='w-[200px] truncate text-[13px] text-muted-foreground'>
							{user?.email}
						</p>
					</div>
				</div>
				<DropdownMenuSeparator />
				<DropdownMenuItem className='cursor-pointer p-0'>
					<Link href={'#'} className='px-2 py-2.5 w-full flex items-center'>
						<UserRoundCog className='w-4 h-auto mr-2' />
						Profile
					</Link>
				</DropdownMenuItem>

				<DropdownMenuItem className='cursor-pointer p-0'>
					<Link href={'#'} className='px-2 py-2.5 w-full flex items-center'>
						<Settings className='w-4 h-auto mr-2' />
						Settings
					</Link>
				</DropdownMenuItem>

				<DropdownMenuItem className='cursor-pointer p-0'>
					<Link href={'#'} className='px-2 py-2.5 w-full flex items-center'>
						{/* <Icons.upload className='w-4 h-auto mr-2 fill-white ' /> */}
						<Upload className='w-4 h-auto mr-2 ' />
						Upload Tracks
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
