import { auth } from '@/lib/auth';
import { notFound } from 'next/navigation';

export default async function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await auth();
	if (!session) {
		notFound();
	}

	return (
		<div className='mt-4'>
			<h2 className='text-3xl md:text-5xl font-semibold'>Upload Track</h2>
			{children}
		</div>
	);
}
