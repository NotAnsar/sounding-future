import { Icons } from '@/components/icons/audio-player';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { buttonVariants } from '../ui/button';

export default function CoursesProOnly({ className }: { className?: string }) {
	return (
		<div
			className={cn(
				'p-6 pb-9 bg-secondary rounded-lg mb-4 flex flex-col gap-4 2xl:w-5/6',
				className
			)}
		>
			<div className='flex gap-5 items-center'>
				<Icons.support className='w-7 h-auto aspect-square min-w-7 max-w-7' />
				<h1 className='text-xl sm:text-2xl font-bold'>
					Why are some lessons Pro only?
				</h1>
			</div>
			<p className='text-pretty leading-7 whitespace-pre-line text-lg '>
				At Sounding Future, our mission is to make cutting-edge 3D audio music,
				knowledge, and education accessible to everyone. To keep the platform
				running, cover infrastructure costs, and support the creation of
				high-quality content, some advanced lessons are available exclusively
				through our affordable Pro Membership. Your membership helps us fund
				independent music projects, develop new tools, and produce even more
				tutorials for the community.
			</p>
			<Link
				href={'/user/settings/membership'}
				className={cn(buttonVariants(), 'w-fit inline-flex mt-2')}
			>
				Become a Pro Member
			</Link>
		</div>
	);
}
