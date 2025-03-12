import Error from '@/components/Error';
import { auth } from '@/lib/auth';

export default async function Page() {
	const [session] = await Promise.all([auth()]);

	if (session?.user.role === 'admin') {
		return <Error message='You are not authorized to view this page' />;
	}

	return (
		<>
			<div
				className='w-full flex gap-4 p-4 rounded-3xl text-white h-auto min-h-40 sm:min-h-48 md:min-h-52 xl:min-h-60 relative'
				style={{
					background: '#cc2b5e',
					backgroundImage: 'linear-gradient(to right, #753a88, #cc2b5e)',
				}}
			>
				<h2 className='text-[36px] leading-tight mb-0 sm:text-5xl sm:leading-none xl:text-6xl font-bold mt-auto sm:mb-2 md:pl-4'>
					Help Center
				</h2>
			</div>
			<div className='max-w-screen-sm space-y-8'>
				<p className='mt-4'>
					From the first steps to advanced functions, you will find everything
					you need to know about the 3D AudioSpace.
				</p>

				<section className='space-y-3'>
					<h2 className='text-3xl font-semibold'>Getting started</h2>

					<p className='pb-2'>
						Discover all the 3D AudioSpace key features in 3 minutes!
					</p>

					<video
						src='http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4'
						controls
						className='w-full rounded-lg mt-2'
						preload='metadata'
					>
						Your browser does not support the video tag.
					</video>
				</section>
				<section className='space-y-3'>
					<h2 className='text-3xl font-semibold'>
						For Creators: Upload & Manage your tracks
					</h2>

					<p className='pb-2'>
						Learn which formats and genres are supported on our platform. This
						video will guide you through the upload process and help you
						optimize your tracks for the best streaming experience.
					</p>
					<video
						src='http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4'
						controls
						className='w-full rounded-lg '
						preload='metadata'
					>
						Your browser does not support the video tag.
					</video>
				</section>
			</div>
		</>
	);
}
