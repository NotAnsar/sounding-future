'use client';

import React, { useEffect } from 'react';
import { useFormState } from 'react-dom';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import ErrorMessage from '@/components/ErrorMessage';
import UploadTrackNav from '@/components/upload-track/UploadTrackNav';
import { addTrackTextInfo } from '@/actions/upload-track/text-info';
import { Textarea } from '@/components/ui/textarea';

export default function ProfileLinksForm() {
	const [state, formAction] = useFormState(addTrackTextInfo, {});
	const router = useRouter();

	useEffect(() => {
		if (state.message === 'Profile updated successfully') {
			router.push('/');
			toast({ description: 'Profile updated successfully', title: 'Success' });
		}
	}, [state, router]);

	return (
		<form action={formAction}>
			<Tabs value='text-info' className='mt-4 sm:mt-8 grid sm:gap-3'>
				<UploadTrackNav />

				<TabsContent value='text-info' className='lg:w-2/3 mt-2 grid gap-6'>
					<ErrorMessage errors={state.message ? [state.message] : undefined} />

					<div className='grid gap-2'>
						<Label
							htmlFor='trackInfo'
							className={cn(state?.errors?.trackInfo ? 'text-destructive' : '')}
						>
							Track Info
						</Label>
						<Textarea
							className={cn(
								'max-w-lg min-h-40',
								state?.errors?.trackInfo
									? 'border-destructive focus-visible:ring-destructive '
									: ''
							)}
							name='trackInfo'
							id='trackInfo'
						/>
						<p className='text-muted text-sm max-w-lg'>
							Tell us a little more about your audio track. For example, the
							concept, the story of how the track came to be, or what it was
							like to work on this track.
						</p>

						<ErrorMessage errors={state?.errors?.trackInfo} />
					</div>

					<div className='grid gap-2'>
						<Label
							htmlFor='more'
							className={cn(state?.errors?.more ? 'text-destructive' : '')}
						>
							Track Credits
						</Label>
						<Textarea
							className={cn(
								'max-w-lg min-h-28',
								state?.errors?.more
									? 'border-destructive focus-visible:ring-destructive '
									: ''
							)}
							name='more'
							id='more'
						/>
						<p className='text-muted text-sm max-w-lg'>
							Mention institutions, assistants, or other people who helped with
							the audio production or whom you would like to thank. Add
							information about the recording studio, the technology you used,
							or the label that released the track.
						</p>

						<ErrorMessage errors={state?.errors?.more} />
					</div>

					<div className='grid gap-2'>
						<Label
							htmlFor='articleLink'
							className={cn(
								state?.errors?.articleLink ? 'text-destructive' : ''
							)}
						>
							Article Link
						</Label>
						<Input
							type='text'
							name='articleLink'
							id='articleLink'
							placeholder='http://'
							className={cn(
								'max-w-lg',
								state?.errors?.articleLink
									? 'border-destructive focus-visible:ring-destructive'
									: ''
							)}
						/>
						<p className='text-muted text-sm max-w-lg'>
							add a link to a Sounding Future article
						</p>
						<ErrorMessage errors={state?.errors?.articleLink} />
					</div>
				</TabsContent>
			</Tabs>
		</form>
	);
}
