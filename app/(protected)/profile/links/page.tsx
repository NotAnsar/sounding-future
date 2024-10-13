'use client';
import { updateProfile } from '@/actions/profile/profile';
import ErrorMessage from '@/components/ErrorMessage';
import ProfileNav from '@/components/profile/ProfileNav';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useFormState } from 'react-dom';

export default function page() {
	const initialState = { message: null, errors: {} };
	const [state, action] = useFormState(updateProfile, initialState);
	const router = useRouter();

	useEffect(() => {
		if (state.message === 'Profile updated successfully') {
			router.push('/');
			toast({ description: 'Profile updated successfully', title: 'Success' });
		}
	}, [state]);

	return (
		<form action={action}>
			<Tabs value={'links'} className='mt-4 sm:mt-8 grid sm:gap-3'>
				<ProfileNav />

				<TabsContent value='links' className='lg:w-2/3 mt-2 grid gap-6'>
					<ErrorMessage errors={state.message ? [state.message] : undefined} />
					<div className='grid gap-2'>
						<Label
							htmlFor='weblink'
							className={cn(state?.errors?.name ? 'text-destructive' : '')}
						>
							Website Link
						</Label>
						<Input
							type='text'
							name='weblink'
							id='weblink'
							placeholder='http://'
							className={cn(
								'max-w-md',
								state?.errors?.name
									? 'border-destructive focus-visible:ring-destructive '
									: ''
							)}
						/>

						<ErrorMessage errors={state?.errors?.name} />
					</div>

					<div className='grid gap-2'>
						<Label
							htmlFor='sociallinks'
							className={cn(state?.errors?.biography ? 'text-destructive' : '')}
						>
							Social media links
						</Label>
						<Textarea
							className={cn(
								'max-w-md min-h-32',
								state?.errors?.biography
									? 'border-destructive focus-visible:ring-destructive '
									: ''
							)}
							name='sociallinks'
							id='sociallinks'
						/>
						<p className='text-muted text-sm'>Link 3 social media accounts</p>
						<ErrorMessage errors={state?.errors?.biography} />
					</div>
					<div className='grid gap-2'>
						<Label
							htmlFor='articles'
							className={cn(state?.errors?.name ? 'text-destructive' : '')}
						>
							Sounding Future article links
						</Label>
						<Input
							type='text'
							name='articles'
							id='articles'
							placeholder='http://'
							className={cn(
								'max-w-md',
								state?.errors?.name
									? 'border-destructive focus-visible:ring-destructive '
									: ''
							)}
						/>
						<p className='text-muted text-sm'>
							Link your Sounding Future articles
						</p>
						<ErrorMessage errors={state?.errors?.name} />
					</div>
				</TabsContent>
			</Tabs>
		</form>
	);
}
