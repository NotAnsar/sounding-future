import BreadCrumb from '@/components/BreadCrumb';
import Error from '@/components/Error';
import TrackBasicsForm from '@/components/TracksCrud/upload/BasicsForm';
import { getArtists } from '@/db/artist';
import { getGenres } from '@/db/genre';
import { getPartners } from '@/db/partner';
import { getSourceFormats } from '@/db/source-format';
import { auth } from '@/lib/auth';
import { notFound } from 'next/navigation';

export default async function page() {
	const [session, sourceFormatData, partners, artists, genres] =
		await Promise.all([
			auth(),
			getSourceFormats(),
			getPartners(),
			getArtists(),
			getGenres(),
		]);

	if (!session) {
		notFound();
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
			/>
		</>
	);
}
