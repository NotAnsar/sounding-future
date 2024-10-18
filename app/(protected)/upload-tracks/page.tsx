'use client';
import { updateUserAccount } from '@/actions/account/settings';
import ErrorMessage from '@/components/ErrorMessage';
import SettingsNav from '@/components/settings/SettingsNav';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useFormState } from 'react-dom';

export default function Page() {
	const initialState = { message: null, errors: {} };
	const [state, action] = useFormState(updateUserAccount, initialState);
	const router = useRouter();

	useEffect(() => {
		if (state.message === 'Account updated successfully') {
			router.push('/');
			toast({ description: 'Account updated successfully', title: 'Success' });
		}
	}, [state, router]);

	return (
		<form action={action}>
			<Tabs value={'settings'} className='mt-4 sm:mt-8 grid sm:gap-3'>
				<SettingsNav />
				<TabsContent value='settings' className='lg:w-2/3 mt-2 grid gap-6'>
					<ErrorMessage errors={state.message ? [state.message] : undefined} />
					<div className='grid gap-x-4 gap-y-2 sm:grid-cols-2 max-w-lg'>
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
								className={cn(
									state?.errors?.secondName
										? 'border-destructive focus-visible:ring-destructive '
										: ''
								)}
							/>

							<ErrorMessage errors={state?.errors?.secondName} />
						</div>
						<p className='text-muted text-sm col-span-full'>
							Your first and last name (will not be displayed publicly)
						</p>
					</div>

					<div className='grid gap-2'>
						<Label
							htmlFor='email'
							className={cn(state?.errors?.email ? 'text-destructive' : '')}
						>
							Email
						</Label>
						<Input
							type='email'
							name='email'
							id='email'
							className={cn(
								'max-w-lg ',
								state?.errors?.email
									? 'border-destructive focus-visible:ring-destructive '
									: ''
							)}
						/>

						<ErrorMessage errors={state?.errors?.email} />
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
							name='username'
							id='username'
						/>

						<p className='text-sm text-muted'>
							The username will be used for login only{' '}
						</p>
						<ErrorMessage errors={state?.errors?.username} />
					</div>
					<div className='grid gap-2'>
						<Label
							htmlFor='password'
							className={cn(state?.errors?.password ? 'text-destructive' : '')}
						>
							Password
						</Label>
						<Input
							className={cn(
								'max-w-lg',
								state?.errors?.password
									? 'border-destructive focus-visible:ring-destructive '
									: ''
							)}
							name='password'
							type='password'
							id='password'
						/>

						<p className='text-sm text-muted'>
							min. 10 characters or numbers, and special char. #, !, $
						</p>
						<ErrorMessage errors={state?.errors?.password} />
					</div>
					<div className='grid gap-2'>
						<Label
							htmlFor='confirmPassword'
							className={cn(
								state?.errors?.confirmPassword ? 'text-destructive' : ''
							)}
						>
							Confirm Password
						</Label>
						<Input
							className={cn(
								'max-w-lg',
								state?.errors?.confirmPassword
									? 'border-destructive focus-visible:ring-destructive '
									: ''
							)}
							name='confirmPassword'
							type='password'
							id='confirmPassword'
						/>

						<p className='text-sm text-muted'>Repeat Password</p>
						<ErrorMessage errors={state?.errors?.confirmPassword} />
					</div>
				</TabsContent>
			</Tabs>
		</form>
	);
}
