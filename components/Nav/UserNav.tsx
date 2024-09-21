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
	FileClock,
	LogOutIcon,
	Settings,
	Upload,
	UserIcon,
	UserRoundCog,
} from 'lucide-react';

import Link from 'next/link';
import { AvatarImage } from '@radix-ui/react-avatar';

export default function UserNav() {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger className='relative'>
				<Avatar className='flex items-center justify-center'>
					<AvatarImage className='h-9 w-auto aspect-square rounded-full' />

					<AvatarFallback className='h-9 w-auto aspect-square bg-button'>
						{/* <span className='sr-only'>{user?.email}</span> */}
						<UserIcon className='h-[17px] w-auto' />
					</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>

			<DropdownMenuContent
				align='end'
				className='max-w-[250px] min-w-[200px] truncate bg-foreground backdrop-blur-md border-transparent'
			>
				<div className='flex items-center justify-start gap-2 p-2'>
					<div className='flex flex-col space-y-1 leading-none truncate'>
						<p className='font-medium text-[15px] truncate'>Frank Zimmer</p>

						{/* <p className='w-[200px] truncate text-[13px] text-muted-foreground'>
							{user?.email}
						</p> */}
					</div>
				</div>
				<DropdownMenuSeparator />
				<DropdownMenuItem className='cursor-pointer p-0'>
					<Link
						href={`/profile/compte`}
						className='px-2 py-2.5 w-full flex items-center'
					>
						<UserRoundCog className='w-4 h-auto mr-2' />
						Profile
					</Link>
				</DropdownMenuItem>

				<DropdownMenuItem className='cursor-pointer p-0'>
					<Link
						href={`/profile/compte`}
						className='px-2 py-2.5 w-full flex items-center'
					>
						<Settings className='w-4 h-auto mr-2' />
						Settings
					</Link>
				</DropdownMenuItem>

				<DropdownMenuItem className='cursor-pointer p-0'>
					<Link
						href={`/profile/offers`}
						className='px-2 py-2.5 w-full flex items-center'
					>
						<Upload className='w-4 h-auto mr-2' />
						Upload Tracks
					</Link>
				</DropdownMenuItem>

				<DropdownMenuSeparator />
				<DropdownMenuItem className='cursor-pointer p-0 '>
					<form className='w-full relative'>
						<button
							type='submit'
							className='p-2 w-full text-left flex items-center'
						>
							<LogOutIcon className='w-4 h-auto mr-2' />
							Log Out
						</button>
					</form>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}