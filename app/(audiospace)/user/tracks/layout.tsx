import ArtistError from '@/components/ArtistError';
import { auth } from '@/lib/auth';
import { notFound } from 'next/navigation';

export default async function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await auth();

	if (!session) notFound();

	if (session?.user?.role === 'user' && !session?.user?.artistId) {
		return <ArtistError />;
	}

	return <>{children}</>;
}
