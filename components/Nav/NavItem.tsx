import { IconProps } from '@/config/sidenav';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { buttonVariants } from '../ui/button';
import { SheetClose } from '../ui/sheet';

export default function NavItem({
	title,
	Icon,
	path,
	currentPath,
	type,
	sheet = false,
}: {
	title: string;
	Icon: (props: IconProps) => JSX.Element;
	path: string;
	currentPath: string;
	type?: 'collection' | undefined;
	sheet?: boolean;
}) {
	const isCollection = type === 'collection';
	const isCurrentPath =
		currentPath.split('/')[isCollection ? 2 : 1] ===
			path.split('/')[isCollection ? 2 : 1] &&
		currentPath.split('/')[1] === 'collection';
	const CommonLink = (
		<Link
			className={cn(
				buttonVariants({
					variant: isCurrentPath ? 'sideNav' : 'sideNavForeground',
				}),
				'justify-start py-2 pr-3 hover:text-white duration-200 transition-none',

				isCurrentPath ? 'text-white' : ''
			)}
			href={path}
		>
			<Icon
				className={cn(
					'mr-2.5 w-[19px] h-auto fill-white',
					isCollection || title === 'Genres' ? 'w-[17px]' : ''
				)}
			/>

			<p className='block text-base font-medium'>{title}</p>
		</Link>
	);
	if (sheet) {
		return <SheetClose asChild>{CommonLink}</SheetClose>;
	}

	return CommonLink;
}
