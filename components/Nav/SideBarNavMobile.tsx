'use client';

import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { collection, mainNav } from '@/config/sidenav';
import { SheetContent } from '../ui/sheet';
import Image from 'next/image';
import NavItem from './NavItem';

export default function SideBarNavMobile({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	const path = usePathname();

	return (
		<SheetContent
			side='left'
			className={cn(
				'w-4/5 sm:w-64 flex flex-col fixed p-5 bg-secondary',
				className
			)}
			{...props}
		>
			<Link href={'/'}>
				<Image
					src={'/logo.png'}
					alt='logo'
					width={288.33}
					height={132}
					className='w-24 ml-3 h-auto hidden dark:block'
				/>
				<Image
					src={'/logo-light.png'}
					alt='logo'
					width={288.33}
					height={132}
					className='w-24 ml-3 h-auto block dark:hidden'
				/>
			</Link>
			<div className='flex flex-col gap-3 py-2 h-full'>
				<div className='px-3 py-2 space-y-6'>
					<div className='flex flex-col gap-2'>
						{mainNav.map((item, i) => (
							<NavItem
								Icon={item.icon}
								title={item.title}
								path={item.path}
								currentPath={path}
								sheet={true}
								key={i}
							/>
						))}
					</div>
				</div>
				<div className='px-3 py-2'>
					<h2 className='text-muted text-xs uppercase pl-4 mb-3 font-medium'>
						MY COLLECTION
					</h2>
					<div className='flex flex-col gap-2'>
						{collection.map((item, i) => (
							<NavItem
								Icon={item.icon}
								title={item.title}
								path={item.path}
								currentPath={path}
								key={i}
								type='collection'
								sheet={true}
							/>
						))}
					</div>
				</div>
				<Link href={'/privacy'} className='mt-auto flex text-muted pl-4'>
					Privacy | Legal
				</Link>
			</div>
		</SheetContent>
	);
}
