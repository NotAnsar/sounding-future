'use client';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Frown } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Error({
	message = 'Please try again later.',
}: {
	message?: string;
}) {
	const router = useRouter();
	const isArtistError = message.includes('set up an artist profile');

	const handleGoBack = () => {
		try {
			if (window.history.length > 2) {
				router.back();
			} else {
				// Fallback to home page if no previous page exists
				router.push('/');
			}
		} catch {
			// If anything goes wrong, fallback to home page
			router.push('/');
		}
	};

	return (
		<main className='flex flex-col items-center justify-center gap-0.5 h-full min-h-[60vh]'>
			<Frown className='w-10 text-muted-foreground' />
			<h2 className='text-xl font-semibold'>Something went wrong!</h2>
			<p className='text-muted'>{message}</p>
			{isArtistError && (
				<Link href={'/user/profile'} className={cn(buttonVariants(), 'mt-2')}>
					Set Up Your Artist Profile
				</Link>
			)}
			<button onClick={handleGoBack} className={cn(buttonVariants(), 'mt-2')}>
				Go Back
			</button>
		</main>
	);
}
