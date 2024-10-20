'use client';

import React, { useEffect } from 'react';
import { useFormState } from 'react-dom';
import { useRouter } from 'next/navigation';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import ErrorMessage from '@/components/ErrorMessage';
import UploadTrackNav from '@/components/upload-track/UploadTrackNav';
import { uploadTrackInfo } from '@/actions/upload-track/audio-file';
import { SelectInput } from '@/components/ui/select-input';
import ImageUpload from '@/components/profile/ImageUpload';
import TrackUpload from '@/components/settings/TrackUploadSection';

export default function ProfileLinksForm() {
	const [state, formAction] = useFormState(uploadTrackInfo, {});
	const router = useRouter();

	useEffect(() => {
		if (state.message === 'Profile updated successfully') {
			router.push('/');
			toast({ description: 'Profile updated successfully', title: 'Success' });
		}
	}, [state, router]);

	return (
		<form action={formAction}>
			<Tabs value='audio-file' className='mt-4 sm:mt-8 grid sm:gap-3'>
				<UploadTrackNav />

				<TabsContent value='audio-file' className='lg:w-2/3 mt-2 grid gap-6'>
					<ErrorMessage errors={state.message ? [state.message] : undefined} />

					<div className='grid gap-2'>
						<Label
							htmlFor='sourceFormat'
							className={cn(
								state?.errors?.sourceFormat ? 'text-destructive' : ''
							)}
						>
							Source Format
						</Label>

						<SelectInput
							options={[
								{ label: 'AmbiX', value: 'AmbiX' },
								{ label: '5.1', value: '5.1' },
								{ label: 'Stereo', value: 'Stereo' },
							]}
							name='sourceFormat'
							placeholder='Select format'
							className='max-w-lg'
						/>

						<p className='text-muted text-sm'>
							Select fromat from list: AmbiX, 5.1, Stereo, ...
						</p>

						<ErrorMessage errors={state?.errors?.sourceFormat} />
					</div>

					{/* <div className='grid gap-2'>
						<Label
							htmlFor='flacFile'
							className={cn(state?.errors?.mp3File ? 'text-destructive' : '')}
						>
							Upload Track
						</Label>

						<div className='grid gap-4'>
							<div className='grid gap-2'>
								<Input
									type='file'
									name='mp3File'
									id='mp3File'
									className={cn(
										'max-w-lg',
										state?.errors?.mp3File
											? 'border-destructive focus-visible:ring-destructive '
											: ''
									)}
								/>

								<p className='text-muted text-sm'>
									upload your track in mp3 format
								</p>

								<ErrorMessage errors={state?.errors?.mp3File} />
							</div>
							<div className='grid gap-2'>
								<Input
									type='file'
									name='flacFile'
									id='flacFile'
									className={cn(
										'max-w-lg',
										state?.errors?.flacFile
											? 'border-destructive focus-visible:ring-destructive '
											: ''
									)}
								/>

								<p className='text-muted text-sm'>
									upload your track in flac format
								</p>

								<ErrorMessage errors={state?.errors?.flacFile} />
							</div>
						</div>
					</div> */}

					<TrackUpload errors={state?.errors} />
					<ImageUpload
						name='imageFile'
						error={state?.errors?.imageFile}
						type='square'
						message='upload your track in jpg format'
						size='lg'
					/>
				</TabsContent>
			</Tabs>
		</form>
	);
}
