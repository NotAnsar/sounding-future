'use client';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Frown } from 'lucide-react';
import Link from 'next/link';

export default function ArtistError() {
	return (
		<main className='flex flex-col items-center justify-center gap-0.5 h-full min-h-[60vh]'>
			<Frown className='w-8 h-auto aspect-square text-muted-foreground' />
			<h2 className='text-xl font-semibold'>Something went wrong!</h2>
			<p className='text-muted text-center text-sm md:text-base '>
				You need to set up an artist profile first. Please visit your profile
				settings to create one before managing your links.
			</p>
			<Link href={'/user/profile'} className={cn(buttonVariants(), 'mt-2')}>
				Set Up Your Artist Profile
			</Link>
		</main>
	);
}
