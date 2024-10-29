import SecondarySection from '@/components/auth/SecondarySection';
import { ModeToggle } from '@/components/ModeToggle';
import Image from 'next/image';
import Link from 'next/link';

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className='relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0'>
			<Link href='/' className='top-6 left-4 md:left-8 md:top-8 absolute '>
				<Image
					src={'/logo.png'}
					alt='logo'
					width={288.33}
					height={132}
					className='w-24 md:w-[104px] h-auto hidden dark:block'
				/>
				<Image
					src={'/logo-light.png'}
					alt='logo'
					width={288.33}
					height={132}
					className='w-24 md:w-[104px] h-auto block dark:hidden'
				/>
			</Link>
			{children}

			<ModeToggle className='absolute top-6 right-6 lg:bottom-12 z-50 lg:left-12 lg:right-auto lg:top-auto ' />

			<SecondarySection />
		</div>
	);
}
