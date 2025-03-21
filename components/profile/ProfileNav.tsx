import Link from 'next/link';
import { TabsList, TabsTrigger } from '../ui/tabs';
import SaveButton from './SaveButton';
import { toast } from '@/hooks/use-toast';

export default function ProfileNav({
	isArtist = true,
	profile = false,
}: {
	isArtist?: boolean;
	profile?: boolean;
}) {
	const handleLinksClick = (e: React.MouseEvent) => {
		if (!isArtist) {
			e.preventDefault();
			toast({
				title: 'Artist Profile Required',
				description:
					'You need to set up an artist profile first to access this section.',
				variant: 'destructive',
			});
		}
	};

	return (
		<div className='w-full flex justify-between gap-2 items-center'>
			<TabsList className='flex w-fit gap-2 sm:gap-4 bg-background text-white justify-start '>
				<TabsTrigger value='profile' className='!p-0'>
					<Link href={'/user/profile'} className='py-1 px-3 '>
						My Profile
					</Link>
				</TabsTrigger>
				<TabsTrigger value='links' className='!p-0'>
					<Link
						href={isArtist ? '/user/profile/links' : '#'}
						className='py-1 px-3'
						onClick={handleLinksClick}
					>
						My Links
					</Link>
				</TabsTrigger>
			</TabsList>
			<SaveButton>{profile ? 'Save & Go Next' : 'Save'}</SaveButton>
		</div>
	);
}
