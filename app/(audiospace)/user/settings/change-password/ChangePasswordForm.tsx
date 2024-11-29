'use client';

import { changePassword } from '@/actions/account/change-password';
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

export default function ChangePasswordForm() {
	const [state, action] = useFormState(changePassword, {});
	const router = useRouter();

	useEffect(() => {
		if (state?.success) {
			router.push('/');
			toast({ description: state.message, title: 'Success' });
		}
	}, [state, router]);

	return (
		<form action={action}>
			<Tabs value={'change-password'} className='mt-4 sm:mt-8 grid sm:gap-3'>
				<SettingsNav />
				<TabsContent
					value='change-password'
					className='lg:w-2/3 mt-4 grid gap-3'
				>
					<ErrorMessage
						errors={
							state?.message && !state.success ? [state?.message] : undefined
						}
					/>
					<div className='grid gap-2'>
						<Label
							htmlFor='current_password'
							className={cn(
								state?.errors?.current_password ? 'text-destructive' : ''
							)}
						>
							Current Password
						</Label>
						<Input
							className={cn(
								'max-w-lg',
								state?.errors?.current_password
									? 'border-destructive focus-visible:ring-destructive '
									: ''
							)}
							name='current_password'
							type='password'
							id='current_password'
						/>

						<p className='text-sm text-muted'>
							Enter your current password to confirm changes
						</p>
						<ErrorMessage errors={state?.errors?.current_password} />
					</div>
					<div className='grid gap-2'>
						<Label
							htmlFor='new_password'
							className={cn(
								state?.errors?.new_password ? 'text-destructive' : ''
							)}
						>
							New Password
						</Label>
						<Input
							className={cn(
								'max-w-lg',
								state?.errors?.new_password
									? 'border-destructive focus-visible:ring-destructive '
									: ''
							)}
							name='new_password'
							type='password'
							id='new_password'
						/>

						<p className='text-sm text-muted'>Enter your new password</p>
						<ErrorMessage errors={state?.errors?.new_password} />
					</div>
					<div className='grid gap-2'>
						<Label
							htmlFor='new_password'
							className={cn(
								state?.errors?.new_passwordconfirm ? 'text-destructive' : ''
							)}
						>
							Confirm New Password
						</Label>
						<Input
							className={cn(
								'max-w-lg',
								state?.errors?.new_passwordconfirm
									? 'border-destructive focus-visible:ring-destructive '
									: ''
							)}
							name='new_passwordconfirm'
							type='password'
							id='new_passwordconfirm'
						/>

						<p className='text-sm text-muted'>Confirm your new password</p>
						<ErrorMessage errors={state?.errors?.new_passwordconfirm} />
					</div>
				</TabsContent>
			</Tabs>
		</form>
	);
}
