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
import ProfileNav from '@/components/profile/ProfileNav';
import { updateProfileLinks } from '@/actions/profile/links';
import SoundingFutureArticlesInput from '@/components/profile/links/SoundingFutureArticlesInput';

export default function ProfileLinksForm() {
	const [state, formAction] = useFormState(updateProfileLinks, {});
	const router = useRouter();

	useEffect(() => {
		if (state.message === 'Profile updated successfully') {
			router.push('/');
			toast({ description: 'Profile updated successfully', title: 'Success' });
		}
	}, [state, router]);

	return (
		<form action={formAction}>
			<Tabs value='links' className='mt-4 sm:mt-8 grid sm:gap-3'>
				<ProfileNav />

				<TabsContent value='links' className='lg:w-2/3 mt-2 grid gap-6'>
					<ErrorMessage errors={state.message ? [state.message] : undefined} />

					{/* Website Link */}
					<div className='grid gap-2'>
						<Label
							htmlFor='websiteLink'
							className={cn(
								state?.errors?.websiteLink ? 'text-destructive' : ''
							)}
						>
							Website Link
						</Label>
						<Input
							type='text'
							name='websiteLink'
							id='websiteLink'
							placeholder='http://'
							className={cn(
								'max-w-lg',
								state?.errors?.websiteLink
									? 'border-destructive focus-visible:ring-destructive'
									: ''
							)}
						/>
						<ErrorMessage errors={state?.errors?.websiteLink} />
					</div>

					{/* Social Media Links */}
					<div className='grid gap-2'>
						<Label
							htmlFor='socialMediaLinks'
							className={cn(
								state?.errors?.socialMediaLinks ? 'text-destructive' : ''
							)}
						>
							Social media links
						</Label>
						{[0, 1, 2].map((index) => (
							<Input
								key={index}
								type='text'
								name='socialMediaLinks'
								placeholder={`Social media link ${index + 1}`}
								className={cn(
									'max-w-lg',
									state?.errors?.socialMediaLinks
										? 'border-destructive focus-visible:ring-destructive'
										: ''
								)}
							/>
						))}
						<p className='text-muted-foreground text-sm'>
							Link 3 social media accounts
						</p>
						<ErrorMessage errors={state?.errors?.socialMediaLinks} />
					</div>

					<SoundingFutureArticlesInput
						errors={state?.errors?.soundingFutureArticles}
					/>
				</TabsContent>
			</Tabs>
		</form>
	);
}
