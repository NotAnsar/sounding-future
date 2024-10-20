import React from 'react';
import UserNav from './UserNav';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import SearchInput from './Search/SearchInput';
import Link from 'next/link';
import { Sheet, SheetTrigger } from '../ui/sheet';
import SideBarNavMobile from './SideBarNavMobile';
import { auth } from '@/lib/auth';
import { ModeToggle } from '../ModeToggle';

export default async function TopNav({ className }: { className?: string }) {
	const session = await auth();

	return (
		<Sheet>
			<div
				className={cn(
					'bg-background fixed w-full flex z-10 gap-4 md:gap-0',
					className
				)}
			>
				<div className='md:w-64 md:min-w-64 md:max-w-64 h-full grid pl-8 items-center'>
					<Link href={'/'}>
						<Image
							src={'/logo.png'}
							alt='logo'
							width={288.33}
							height={132}
							className='w-24 md:w-32 h-auto hidden dark:block'
						/>
						<Image
							src={'/logo-light.png'}
							alt='logo'
							width={288.33}
							height={132}
							className='w-24 md:w-32 h-auto block dark:hidden'
						/>
					</Link>
				</div>
				<div className='w-full h-full flex items-center justify-between px-4 md:p-8 gap-2 md:gap-0'>
					<SearchInput className='sm:w-full md:w-2/3 lg:w-1/2 hidden sm:block ' />
					<div className='ml-auto flex items-center gap-2'>
						<SheetTrigger asChild>
							<Button
								variant='ghost'
								size='icon'
								className='shrink-0 md:hidden text-foreground hover:text-foreground hover:bg-secondary'
							>
								<Menu className='h-7 w-auto aspect-square' />
								<span className='sr-only'>Toggle navigation menu</span>
							</Button>
						</SheetTrigger>
						<ModeToggle />
						{session?.user && <UserNav user={session?.user} />}
					</div>
				</div>
			</div>
			<SideBarNavMobile />
		</Sheet>
	);
}
