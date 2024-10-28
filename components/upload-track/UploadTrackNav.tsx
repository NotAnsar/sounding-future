import Link from 'next/link';
import { TabsList, TabsTrigger } from '../ui/tabs';
import SaveButton from '../profile/SaveButton';

export default function UploadTrackNav() {
	return (
		<div className='w-full flex justify-between gap-2 items-center'>
			<TabsList className='flex w-fit gap-2 sm:gap-4 bg-background text-white justify-start '>
				<TabsTrigger value='basics' className='!p-0'>
					<Link href={'/user/upload-track'} className='py-1 px-3 '>
						Basics
					</Link>
				</TabsTrigger>
				<TabsTrigger value='audio-file' className='!p-0'>
					<Link href={'/user/upload-track/audio-file'} className='py-1 px-3'>
						Audio File
					</Link>
				</TabsTrigger>
				<TabsTrigger value='text-info' className='!p-0'>
					<Link href={'/user/upload-track/text-info'} className='py-1 px-3'>
						Text Info
					</Link>
				</TabsTrigger>
			</TabsList>
			<SaveButton />
		</div>
	);
}
