'use client';

import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { collection, mainNav } from '@/config/sidenav';
import NavItem from './NavItem';
import { LEGAL_NAV } from '@/config/legal';
import { Fragment } from 'react';

export default function SideBarNav({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	const path = usePathname();

	return (
		<div
			className={cn(
				'w-64 flex flex-col fixed p-5 bg-secondary rounded-tr-3xl',
				className
			)}
			{...props}
		>
			<div className='flex flex-col gap-3 py-2 h-full'>
				<div className='px-3 py-2 space-y-6'>
					<div className='flex flex-col gap-2'>
						{mainNav.map((item, i) => (
							<NavItem
								Icon={item.icon}
								title={item.title}
								path={item.path}
								currentPath={path}
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
							/>
						))}
					</div>
				</div>
				<div className='flex mt-auto mb-20 pl-4 text-muted'>
					{LEGAL_NAV.map((l, index) => (
						<Fragment key={l.href}>
							<Link href={l.href}>{l.label}</Link>
							{index < LEGAL_NAV.length - 1 && <span className='px-1'>|</span>}
						</Fragment>
					))}
				</div>
			</div>
		</div>
	);
}
