import BreadCrumb from '@/components/BreadCrumb';
import Error from '@/components/Error';
import TrackInfoForm from '@/components/TracksCrud/upload/InfoForm';
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

	// Handle missing track
	if (track.error || !track.data) {
		return <Error message={track.message} />;
	}

	// Authorization check
	const isUnauthorizedAccess =
		session?.user?.role === 'user' &&
		session?.user?.artistId !== track.data?.artistId;

	if (isUnauthorizedAccess) {
		return <Error message='You do not have permission to edit this track' />;
	}

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

			<TrackInfoForm id={id} initialData={track.data} />
		</>
	);
}
