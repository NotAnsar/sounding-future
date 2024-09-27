import SecondarySection from '@/components/auth/SecondarySection';
import Image from 'next/image';

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className='relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0'>
			<Image
				src={'/logo.png'}
				alt='logo'
				width={288.33}
				height={132}
				className='w-24 md:w-[104px] h-auto top-6 left-4 md:left-8 md:top-8 absolute'
			/>
			{children}

			<SecondarySection />
		</div>
	);
}
