import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Frown } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
	return (
		<main className='flex flex-col items-center justify-center gap-0.5 h-full'>
			<Frown className='w-10 text-muted-foreground' />
			<h2 className='text-xl font-semibold'>404 Not Found</h2>
			<p className='text-muted'>Could not find the requested page.</p>
			<Link href='/' className={cn(buttonVariants(), 'mt-2')}>
				Go Back
			</Link>
		</main>
	);
}
