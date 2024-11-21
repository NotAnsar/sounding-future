'use client';

import ErrorMessage from '@/components/ErrorMessage';
import { useFormState } from 'react-dom';
import TrackNavUpload from '@/components/upload-track/TrackNav';
import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import TrackUpload from '@/components/settings/TrackUploadSection';
import { uploadTrackInfo } from '@/actions/upload-track/audio-file';
import { AlertUploadTrack } from './BasicsForm';

export default function AudioFileForm({
	id,
	role,
}: {
	id: string;
	role: string;
}) {
	const initialState = { message: null, errors: {} };
	const [state, action] = useFormState(
		uploadTrackInfo.bind(null, id),
		initialState
	);

	return (
		<form action={action} className='mt-4 sm:mt-8 grid sm:gap-3'>
			<TrackNavUpload step={3} isAdmin={role === 'admin'} />
			<AlertUploadTrack />
			<div className='lg:w-2/3 mt-2 grid gap-4 max-w-screen-sm'>
				<ErrorMessage errors={state?.message ? [state?.message] : undefined} />

				<div className='space-y-6'>
					<div className='space-y-4'>
						<h3 className='text-lg font-medium'>
							Please send your audio file in one of the following formats:
						</h3>

						<div className='space-y-4'>
							<div>
								<p className='font-medium'>
									{
										'1) [preferred] HOA5 (Higher Order Ambisionics) file in AmbiX (SN3D).'
									}
								</p>
								<p className='text-sm text-muted ml-4'>
									This gives us the most flexibility for further development.
									(Dynamic Streaming) We will convert your file to binaural
									audio.
								</p>
							</div>

							<div>
								<p className='font-medium'>
									2) Channel-based audio file (5.1, 7.2, ...).
								</p>
								<p className='text-sm text-muted ml-4'>
									We will convert your file to binaural audio. (Dynamic
									Streaming)
								</p>
							</div>

							<div>
								<p className='font-medium'>{'3) Binaural audio file.'}</p>
								<p className='text-sm text-muted ml-4'>
									This will limit the playback mode to binaural static streaming
									with headphones.
								</p>
							</div>
						</div>
					</div>

					{/* Upload Section */}
					{role === 'admin' ? (
						<TrackUpload errors={state?.errors} />
					) : (
						<div className='space-y-4'>
							<h2 className='text-2xl font-semibold text-primary-foreground'>
								Audio file upload service
							</h2>

							<div className='flex items-center gap-4'>
								{/* <button className='bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded'></button> */}
								<Link
									href={'https://soundingfuture.filemail.com/'}
									target='_blank'
									className={cn(
										buttonVariants(),
										'bg-green-600 hover:bg-green-700'
									)}
								>
									Upload your track
								</Link>
								<span className='text-sm sm:text-base'>
									Use Password:{' '}
									<code className='bg-muted px-2 py-1 rounded text-white'>
										3daudio
									</code>
								</span>
							</div>

							<p>
								Your track will be published after we have checked it and
								converted it to a binaural audio file. We will notify you as
								soon as it is online.
							</p>
						</div>
					)}

					{/* Converted Tracks Section */}
					{/* <div className='space-y-4'>
						<h3 className='text-lg font-medium'>Converted tracks</h3>

						<div className='space-y-2'>
							<div className='bg-gray-800 p-4 rounded'>track - variant 1</div>
							<div className='bg-gray-800 p-4 rounded'>track - variant 2</div>
						</div>

						<p className='text-sm text-gray-400'>
							Converted Track upload will be done by admin.
						</p>
					</div> */}
				</div>
			</div>
		</form>
	);
}
