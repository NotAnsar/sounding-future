import FollowPopUp from '@/components/artists-crud/FollowPopUp';
import Error from '@/components/Error';
import { getMyArtist } from '@/db/artist';
import { auth } from '@/lib/auth';

export default async function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [session, artist] = await Promise.all([auth(), getMyArtist()]);

	if (session?.user.role === 'admin') {
		return <Error message='You are not authorized to view this page' />;
	}

	return (
		<div className='mt-4 max-w-screen-lg'>
			<div className='flex justify-between items-center'>
				<h2 className='text-[42px] md:text-5xl lg:text-6xl font-semibold'>
					Artist Profile
				</h2>

				{session?.user.artistId && (
					<FollowPopUp
						isAdmin={false}
						id={session?.user.artistId}
						followers={artist?._count?.followers ?? 0}
					/>
				)}
			</div>

			{children}
		</div>
	);
}
