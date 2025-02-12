'use client';

import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { collection, mainNav } from '@/config/sidenav';
import NavItem from './NavItem';
import { LEGAL_NAV } from '@/config/legal';
import { Fragment } from 'react';
import { useAudio } from '@/context/AudioContext';

export default function SideBarNav({
	isAuth,
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement> & { isAuth?: boolean }) {
	const path = usePathname();
	const { currentTrack } = useAudio();

	return (
		<div
			className={cn(
				'w-64 flex flex-col fixed p-5 bg-secondary rounded-tr-3xl',
				className
			)}
			{...props}
		>
			<div className='flex flex-col gap-3 py-2 h-full overflow-y-auto'>
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
				{isAuth ? (
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
				) : null}

				<div
					className={cn(
						'flex mt-auto pl-4 text-muted',
						currentTrack ? 'mb-20' : ''
					)}
				>
					{LEGAL_NAV.filter((l) => l.show).map((l, index, t) => (
						<Fragment key={l.href}>
							<Link href={l.href}>{l.label}</Link>
							{index < t.length - 1 && <span className='px-1'>|</span>}
						</Fragment>
					))}
				</div>
			</div>
		</div>
	);
}
