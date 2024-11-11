import BreadCrumb from '@/components/BreadCrumb';
import TrackBasicsForm from '@/components/TracksCrud/upload/BasicsForm';
import { auth } from '@/lib/auth';
import { notFound } from 'next/navigation';

export default async function page() {
	const session = await auth();

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

			<TrackBasicsForm role={session?.user?.role || ''} />
		</>
	);
}
