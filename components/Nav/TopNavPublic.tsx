import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { ModeToggle } from '../ModeToggle';
import { auth } from '@/lib/auth';
import UserNav from './UserNav';
import { buttonVariants } from '../ui/button';
import { cn } from '@/lib/utils';
import { LogIn } from 'lucide-react';

export default async function TopNavPublic() {
	const session = await auth();
	return (
		<div className='bg-background fixed w-full z-10 md:gap-0 border-b top-0 '>
			<header
				className={
					'max-w-screen-xl w-full flex gap-4 items-center h-20 mx-auto'
				}
			>
				<div className='h-full grid pl-8 items-center'>
					<Link href={'/'}>
						<Image
							src={'/logo.png'}
							alt='logo'
							width={288.33}
							height={132}
							className='w-24 md:w-[104px] h-auto hidden dark:block'
						/>
						<Image
							src={'/logo-light.png'}
							alt='logo'
							width={288.33}
							height={132}
							className='w-24 md:w-[104px] h-auto block dark:hidden'
						/>
					</Link>
				</div>
				<div className='w-full h-full flex items-center justify-between px-4 md:p-8 gap-2 md:gap-0'>
					<div className='ml-auto flex items-center gap-2'>
						<ModeToggle />
						{session?.user ? (
							<UserNav user={session?.user} />
						) : (
							<Link className={cn(buttonVariants(), 'bg-button hover:bg-button/80','group')} href={'/login'}>
								<LogIn className='w-4 h-auto aspect-square mr-2 group-hover:translate-x-0.5 transition-all duration-300 ease-out' />
								Login
							</Link>
						)}
					</div>
				</div>
			</header>
		</div>
	);
}
