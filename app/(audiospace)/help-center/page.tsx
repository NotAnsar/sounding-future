import ContactUsButton from '@/components/termsAndLegal/ContactUsButton';
import VideoPlayer from '@/components/VideoPlayer';
import { getHelpCenter } from '@/db/help-center';

export default async function Page() {
	const { data } = await getHelpCenter(true);
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
			<div className='space-y-8'>
				<p className='mt-4 lg:max-w-screen-sm '>
					From the first steps to advanced functions, you will find everything
					you need to know about the 3D AudioSpace.
				</p>
				{data.length === 0 && (
					<div className='flex items-center justify-center h-96'>
						<p className='text-2xl text-muted'>No videos found</p>
					</div>
				)}
				<div className='grid gap-8 xl:grid-cols-2'>
					{data.map((d) => (
						<section className='flex flex-col gap-2 h-full' key={d.id}>
							<h2 className='text-[28px] leading-tight font-semibold'>
								{d.title}
							</h2>

							<p className='pb-2 '>{d.description}</p>

							<div className='aspect-video relative w-full mt-auto rounded-lg overflow-hidden border-2'>
								<VideoPlayer
									src={d.videoUrl || ''}
									poster={d.thumbnailUrl || undefined}
									title={d.title}
									className='w-full h-full'
									hlsUrl={d.hlsUrl || undefined}
								/>
							</div>
						</section>
					))}
				</div>

				<div className='space-y-2 lg:max-w-screen-sm '>
					<p>
						If you have any questions or suggestions for us, please contact us
						via our contact form.
					</p>
					<ContactUsButton />
				</div>
			</div>
		</>
	);
}
