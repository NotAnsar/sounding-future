import Link from 'next/link';
import { TabsList, TabsTrigger } from '../ui/tabs';
import SaveButton from '../profile/SaveButton';

export default function SettingsNav() {
	return (
		<div className='w-full flex justify-between gap-2 items-center'>
			<TabsList className='flex w-fit gap-2 sm:gap-4 bg-background text-white justify-start '>
				<TabsTrigger value='settings' className='!p-0'>
					<Link href={'/user/settings'} className='py-1 px-3 '>
						My Information
					</Link>
				</TabsTrigger>
				<TabsTrigger value='appearance' className='!p-0'>
					<Link href={'/user/settings/appearance'} className='py-1 px-3'>
						Appearance
					</Link>
				</TabsTrigger>
			</TabsList>
			<SaveButton />
		</div>
	);
}
