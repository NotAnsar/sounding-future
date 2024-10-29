'use client';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Frown } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function NotFound() {
	const router = useRouter();

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
		<main className='flex flex-col items-center justify-center gap-0.5 h-full'>
			<Frown className='w-10 text-muted-foreground' />
			<h2 className='text-xl font-semibold'>404 Not Found</h2>
			<p className='text-muted'>Could not find the requested page.</p>
			<button onClick={handleGoBack} className={cn(buttonVariants(), 'mt-2')}>
				Go Back
			</button>
		</main>
	);
}
