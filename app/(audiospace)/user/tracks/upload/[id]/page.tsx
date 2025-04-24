import BreadCrumb from '@/components/BreadCrumb';
import Error from '@/components/Error';
import TrackBasicsForm from '@/components/TracksCrud/upload/BasicsForm';
import { getAllArtists } from '@/db/artist';
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
			getAllArtists(),
			getGenres(),
			getTrackById(id),
		]);

	if (track.error || !track.data) {
		return <Error message={track.message} />;
	}

	// Handle authentication
	if (!session) {
		redirect('/login');
	}

	// Authorization check
	// const isUnauthorizedAccess =
	// 	session?.user?.role === 'user' &&
	// 	session?.user?.artistId !== track.data?.artistId;

	const isUnauthorizedAccess =
		session?.user?.role !== 'admin' &&
		!track.data?.artists?.some(
			(artist) => artist.artistId === session?.user?.artistId
		);

	if (isUnauthorizedAccess) {
		return <Error message='You do not have permission to edit this track' />;
	}

	if (
		artists.error ||
		genres.error ||
		partners.error ||
		sourceFormatData.error
	) {
		return <Error message='Unable to retrieve data. Please try again later.' />;
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
				sourceFormatData={sourceFormatData.data}
				partnersData={partners.data}
				artistsData={artists.data}
				genresData={genres.data}
				initialData={track.data}
			/>
		</>
	);
}
