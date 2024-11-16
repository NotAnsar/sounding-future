import BreadCrumb from '@/components/BreadCrumb';
import TrackBasicsForm from '@/components/TracksCrud/upload/BasicsForm';
import { getSourceFormats } from '@/db/source-format';
import { auth } from '@/lib/auth';
import { notFound } from 'next/navigation';

export default async function page() {
	const [session, sourceFormatData] = await Promise.all([
		auth(),
		getSourceFormats(),
	]);

	if (!session) {
		notFound();
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
			/>
		</>
	);
}
