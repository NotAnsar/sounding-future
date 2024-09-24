'use client';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

import { usePathname } from 'next/navigation';

import Link from 'next/link';
import { collection, IconProps, mainNav } from '@/config/sidenav';

export default function SideBarNav({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	const path = usePathname();

	return (
		<div
			className={cn(
				'w-64 flex flex-col fixed p-5 bg-foreground rounded-tr-3xl',
				className
			)}
			{...props}
		>
			<div className='space-y-4 py-4'>
				<div className='px-3 py-2 space-y-6'>
					<div className='flex flex-col gap-2'>
						{mainNav.map((item, i) => (
							<Nav
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
							<Nav
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
			</div>
		</div>
	);
}

function Nav({
	title,
	Icon,
	path,
	currentPath,
	type,
}: {
	title: string;
	Icon: (props: IconProps) => JSX.Element;
	path: string;
	currentPath: string;
	type?: 'collection' | undefined;
}) {
	return (
		<Link
			className={cn(
				buttonVariants({
					variant: path === currentPath ? 'sideNav' : 'sideNavForeground',
				}),
				'justify-start py-2 pr-3'
			)}
			href={path}
		>
			<Icon
				className={cn(
					'mr-2.5 w-[19px] h-auto fill-white',
					type === 'collection' || title === 'Genres' ? 'w-[17px]' : ''
				)}
			/>

			<p className='block text-base font-medium'>{title}</p>
		</Link>
	);
}
