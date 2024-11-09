import BreadCrumb from '@/components/BreadCrumb';
import AudioFileForm from '@/components/TracksCrud/upload/AudioFileForm';
import { auth } from '@/lib/auth';
import { notFound } from 'next/navigation';

export default async function page({
	params: { id },
}: {
	params: { id: string };
}) {
	const session = await auth();

	if (!session) {
		notFound();
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

			<AudioFileForm id={id} role={session?.user?.role || ''} />
		</>
	);
}
