import Error from '@/components/Error';
import { auth } from '@/lib/auth';

export default async function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await auth();

	if (session?.user.role === 'admin') {
		return <Error message='You are not authorized to view this page' />;
	}

	return (
		<div className='mt-4 max-w-screen-lg'>
			<h2 className='text-[42px] md:text-5xl lg:text-6xl font-semibold'>
				Artist Profile
			</h2>
			{children}
		</div>
	);
}
