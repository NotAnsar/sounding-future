import BreadCrumb from '@/components/BreadCrumb';
import TrackBasicsForm from '@/components/TracksCrud/upload/BasicsForm';
import { getArtists } from '@/db/artist';
import { getGenres } from '@/db/genre';
import { getPartners } from '@/db/partner';
import { getSourceFormats } from '@/db/source-format';
import { getTrackById } from '@/db/tracks';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function page({
	params: { id },
}: {
	params: { id: string };
}) {
	const [session, sourceFormatData, partners, artists, genres, track] =
		await Promise.all([
			auth(),
			getSourceFormats(),
			getPartners(),
			getArtists(),
			getGenres(),
			getTrackById(id),
		]);

	// Handle authentication
	if (!session) {
		redirect('/login');
	}

	// Handle missing track
	if (!track) {
		throw new Error('Track not found');
	}

	// Authorization check
	const isUnauthorizedAccess =
		session?.user?.role === 'user' &&
		session?.user?.artistId !== track?.artistId;

	if (isUnauthorizedAccess) {
		throw new Error('You do not have permission to edit this track');
	}

	return (
		<>
			<div className=' flex flex-col  justify-between mt-4 mb-12 gap-3'>
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

			<TrackBasicsForm
				role={session?.user?.role || ''}
				sourceFormatData={sourceFormatData}
				partnersData={partners}
				artistsData={artists}
				genresData={genres}
				initialData={track}
			/>
		</>
	);
}
