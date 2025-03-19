import Link from 'next/link';
import { TabsList, TabsTrigger } from '../ui/tabs';
import SaveButton from '../profile/SaveButton';

export default function SettingsNav() {
	return (
		<div className='w-full flex flex-col space-y-4 sm:space-y-6 md:space-y-0 md:flex-row justify-start items-start md:justify-between md:items-center'>
			<TabsList className='w-full md:w-fit flex flex-wrap gap-2 bg-background text-white flex-col items-start sm:flex-row sm:items-center justify-start'>
				<TabsTrigger value='settings' className='!p-0 w-full sm:w-auto'>
					<Link href={'/user/settings'} className='py-1 px-3 block w-full'>
						My Information
					</Link>
				</TabsTrigger>
				<TabsTrigger value='appearance' className='!p-0 w-full sm:w-auto'>
					<Link
						href={'/user/settings/appearance'}
						className='py-1 px-3 block w-full'
					>
						Appearance
					</Link>
				</TabsTrigger>
				<TabsTrigger value='change-password' className='!p-0 w-full sm:w-auto'>
					<Link
						href={'/user/settings/change-password'}
						className='py-1 px-3 block w-full'
					>
						Change Password
					</Link>
				</TabsTrigger>
				<TabsTrigger value='membership' className='!p-0 w-full sm:w-auto'>
					<Link
						href={'/user/settings/membership'}
						className='py-1 px-3 block w-full'
					>
						My Membership
					</Link>
				</TabsTrigger>
			</TabsList>
			<SaveButton className='self-end mt-4 md:mt-0 md:self-auto' />
		</div>
	);
}
