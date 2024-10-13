import Link from 'next/link';
import { TabsList, TabsTrigger } from '../ui/tabs';
import SaveButton from './SaveButton';

export default function ProfileNav() {
	return (
		<div className='w-full flex justify-between gap-2 items-center'>
			<TabsList className='flex w-fit gap-2 sm:gap-4 bg-background text-white justify-start '>
				<TabsTrigger value='profile' className='!p-0'>
					<Link href={'/profile'} className='py-1 px-3 '>
						My Profile
					</Link>
				</TabsTrigger>
				<TabsTrigger value='links' className='!p-0'>
					<Link href={'/profile/links'} className='py-1 px-3'>
						My Links
					</Link>
				</TabsTrigger>
			</TabsList>
			<SaveButton />
		</div>
	);
}
