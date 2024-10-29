'use client';

import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { mainNav } from '@/config/sidenav';

import { SheetContent } from '../ui/sheet';
import Image from 'next/image';
import NavItem from './NavItem';
import { Fragment } from 'react';
import { LEGAL_NAV } from '@/config/legal';

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
			<div className='flex flex-col gap-3 py-2 h-full overflow-y-auto'>
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
				{/* {session ? (
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
				) : null} */}

				<div className='flex mt-auto mb-20 pl-4 text-muted'>
					{LEGAL_NAV.map((l, index) => (
						<Fragment key={l.href}>
							<Link href={l.href}>{l.label}</Link>
							{index < LEGAL_NAV.length - 1 && <span className='px-1'>|</span>}
						</Fragment>
					))}
				</div>
			</div>
		</SheetContent>
	);
}
