'use client';

import { updateUserAccount, SettingsState } from '@/actions/account/settings';
import ErrorMessage from '@/components/ErrorMessage';
import SettingsNav from '@/components/settings/SettingsNav';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { User } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useFormState } from 'react-dom';
import ProfileImageInput from './ProfileImageInput';

export default function UserInfoForm({ initialData }: { initialData: User }) {
	const initialState: SettingsState = {
		message: null,
		errors: {},
		prev: { image: initialData?.image || undefined },
	};
	const [state, action] = useFormState(updateUserAccount, initialState);
	const router = useRouter();

	useEffect(() => {
		if (state?.success) {
			router.push('/');
			toast({ description: 'Account updated successfully', title: 'Success' });
		}
	}, [state, router]);

	return (
		<form action={action}>
			<Tabs value={'settings'} className='mt-4 sm:mt-8 grid sm:gap-3'>
				<SettingsNav />
				<TabsContent value='settings' className='lg:w-2/3 mt-2 grid gap-6'>
					<ErrorMessage
						errors={state?.message ? [state?.message] : undefined}
					/>

					<div className='grid gap-2'>
						<ProfileImageInput
							name='image'
							userFullName={initialData.name}
							error={state?.errors?.image}
							initialData={initialData.image || undefined}
						/>
						<ErrorMessage errors={state?.errors?.image} />
					</div>
					<div className='grid gap-2'>
						<Label
							htmlFor='username'
							className={cn(state?.errors?.username ? 'text-destructive' : '')}
						>
							Username
						</Label>
						<Input
							className={cn(
								'max-w-lg',
								state?.errors?.username
									? 'border-destructive focus-visible:ring-destructive '
									: ''
							)}
							type='text'
							defaultValue={initialData?.name || undefined}
							name='username'
							id='username'
						/>

						<p className='text-sm text-muted'>
							The username will be used for login only{' '}
						</p>
						<ErrorMessage errors={state?.errors?.username} />
					</div>

					{/* <div className='grid gap-x-4 gap-y-2 sm:grid-cols-2 max-w-lg'>
						<div className='grid gap-2'>
							<Label
								htmlFor='firstName'
								className={cn(
									state?.errors?.firstName ? 'text-destructive' : ''
								)}
							>
								First name
							</Label>
							<Input
								type='text'
								name='firstName'
								id='firstName'
								defaultValue={initialData?.f_name || undefined}
								className={cn(
									state?.errors?.firstName
										? 'border-destructive focus-visible:ring-destructive '
										: ''
								)}
							/>

							<ErrorMessage errors={state?.errors?.firstName} />
						</div>
						<div className='grid gap-2'>
							<Label
								htmlFor='secondName'
								className={cn(
									state?.errors?.secondName ? 'text-destructive' : ''
								)}
							>
								Second name
							</Label>
							<Input
								type='text'
								name='secondName'
								id='secondName'
								defaultValue={initialData?.l_name || undefined}
								className={cn(
									state?.errors?.secondName
										? 'border-destructive focus-visible:ring-destructive '
										: ''
								)}
							/>

							<ErrorMessage errors={state?.errors?.secondName} />
						</div>
						<p className='text-muted text-sm max-w-lg col-span-full'>
							Your first and last name (will not be displayed publicly)
						</p>
					</div> */}

					<div className='grid gap-2'>
						<Label htmlFor='email'>Email</Label>
						<Input
							type='email'
							name='email'
							id='email'
							defaultValue={initialData?.email || undefined}
							className={cn('max-w-lg ')}
							disabled
						/>
					</div>
				</TabsContent>
			</Tabs>
		</form>
	);
}
