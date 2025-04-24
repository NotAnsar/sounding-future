import BreadCrumb from '@/components/BreadCrumb';
import Error from '@/components/Error';
import AudioFileForm from '@/components/TracksCrud/upload/AudioFileForm';
import { getTrackById } from '@/db/tracks';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function page({
	params: { id },
}: {
	params: { id: string };
}) {
	const [session, track] = await Promise.all([auth(), getTrackById(id)]);

	// Handle authentication
	if (!session) {
		redirect('/login');
	}

	if (track.error || !track.data) {
		return <Error message={track.message} />;
	}

	const isUnauthorizedAccess =
		session?.user?.role !== 'admin' &&
		!track.data?.artists?.some(
			(artist) => artist.artistId === session?.user?.artistId
		);

	if (isUnauthorizedAccess) {
		return <Error message='You do not have permission to edit this track' />;
	}

	const userRole = session.user?.role || '';

	return (
		<>
			<div className='flex items-center justify-between mt-4 mb-12'>
				<BreadCrumb
					items={[
						{ link: '/user/tracks', text: 'Tracks' },

						{
							link: '/user/tracks/upload',
							text: 'Upload Track',
							isCurrent: true,
						},
					]}
				/>
			</div>

			<AudioFileForm id={id} role={userRole} initialData={track.data} />
		</>
	);
}
