// 'use client';

// import React, { useEffect } from 'react';
// import { useFormState } from 'react-dom';
// import { useRouter } from 'next/navigation';
// import { Label } from '@/components/ui/label';
// import { Tabs, TabsContent } from '@/components/ui/tabs';
// import { toast } from '@/hooks/use-toast';
// import { cn } from '@/lib/utils';
// import ErrorMessage from '@/components/ErrorMessage';
// import UploadTrackNav from '@/components/upload-track/UploadTrackNav';
// import { uploadTrackInfo } from '@/actions/upload-track/audio-file';
// import { SelectInput } from '@/components/ui/select-input';
// import ImageUpload from '@/components/profile/ImageUpload';
// import TrackUpload from '@/components/settings/TrackUploadSection';

// export default function TrackAudioFileForm({ role }: { role: string }) {
export default function TrackAudioFileForm() {
	return <h1>dsmlqd</h1>;
	// const [state, formAction] = useFormState(uploadTrackInfo, {});
	// const router = useRouter();

	// useEffect(() => {
	// 	if (state?.message === 'Files uploaded successfully') {
	// 		router.push('/');
	// 		toast({
	// 			description: 'Audio Files uploaded successfully',
	// 			title: 'Success',
	// 		});
	// 	}
	// }, [state, router]);

	// return (
	// 	<form action={formAction}>
	// 		<Tabs value='audio-file' className='mt-4 sm:mt-8 grid sm:gap-3'>
	// 			<UploadTrackNav isAdmin={role === 'admin'} />

	// 			<TabsContent value='audio-file' className='lg:w-2/3 mt-2 grid gap-6'>
	// 				<ErrorMessage errors={state.message ? [state.message] : undefined} />

	// 				<div className='grid gap-2'>
	// 					<Label
	// 						htmlFor='sourceFormat'
	// 						className={cn(
	// 							state?.errors?.sourceFormat ? 'text-destructive' : ''
	// 						)}
	// 					>
	// 						Source Format
	// 					</Label>

	// 					<SelectInput
	// 						options={[
	// 							{ label: 'AmbiX', value: 'AmbiX' },
	// 							{ label: '5.1', value: '5.1' },
	// 							{ label: 'Stereo', value: 'Stereo' },
	// 						]}
	// 						name='sourceFormat'
	// 						placeholder='Select format'
	// 						className='max-w-lg'
	// 					/>

	// 					<p className='text-muted text-sm max-w-lg'>
	// 						Select fromat from list: AmbiX, 5.1, Stereo, ...
	// 					</p>

	// 					<ErrorMessage errors={state?.errors?.sourceFormat} />
	// 				</div>

	// 				<TrackUpload errors={state?.errors} />

	// 				<ImageUpload
	// 					name='imageFile'
	// 					error={state?.errors?.imageFile}
	// 					type='square'
	// 					message='Upload a cover photo for your track (jpeg, min. 1000x1000px)'
	// 					size='lg'
	// 					label='Track Cover'
	// 				/>
	// 			</TabsContent>
	// 		</Tabs>
	// 	</form>
	// );
}
