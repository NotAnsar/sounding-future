import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await auth();

	if (!session || session.user.role !== 'admin') {
		redirect('/');
	}

	return <>{children}</>;
}
