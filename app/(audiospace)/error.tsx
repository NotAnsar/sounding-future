'use client';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Frown } from 'lucide-react';
import { useEffect } from 'react';

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.log(error.message);

		console.error(error.message);
	}, [error]);

	return (
		<>
			<main className='flex flex-col items-center justify-center gap-0.5 h-full'>
				<Frown className='w-8 h-auto aspect-square text-muted-foreground' />
				<h2 className='text-xl font-semibold'>Something went wrong!</h2>
				{error.message && <p className='text-muted'>{error.message}</p>}
				<button
					onClick={
						// Attempt to recover by trying to re-render the segment
						() => reset()
					}
					className={cn(buttonVariants(), 'mt-2')}
				>
					Try again
				</button>
			</main>
		</>
	);
}
