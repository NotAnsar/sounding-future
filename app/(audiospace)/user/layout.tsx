import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await auth();

	if (!session) redirect('/');

	return <>{children}</>;
}
