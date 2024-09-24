import { cn } from '@/lib/utils';
// import Image from 'next/image';

export default function SecondarySection() {
	return (
		<div className='relative hidden h-full flex-col p-10 text-white lg:flex dark:border-r '>
			<div className='absolute inset-0 bg-primary/40 p-10 z-10 opacity-70' />
			<div className='absolute inset-0 bg-auth bg-cover bg-center' />

			<h1 className='text-white font-bold text-6xl xl:text-7xl leading-[1.3] xl:leading-tight z-10 text-right '>
				Explore <br /> 3D Audio
			</h1>
			<div className='relative z-10 mt-auto pb-4'>
				<blockquote className='space-y-2'>
					<p className={cn('text-right font-medium text-2xl ml-auto')}>
						&ldquo; Electronic Music, Contemporary
						<br />
						Music, Game Audio, Sound Art,
						<br /> Soundscapes and more. &rdquo;
					</p>
				</blockquote>
			</div>
		</div>
	);
}
