'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFormState } from 'react-dom';
import ErrorMessage from '../ErrorMessage';
import { SubmitButton } from './SubmitButton';
import { cn } from '@/lib/utils';
import SignWithGoogle from './SignWithGoogle';
import { resetPasswordCompletion } from '@/actions/auth/reset-password';
import { useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function UpdatePasswordForm({ token }: { token: string }) {
	const [state, formAction] = useFormState(
		resetPasswordCompletion.bind(null, token),
		{}
	);
	const router = useRouter();

	useEffect(() => {
		if (state.message) {
			if (state.success) {
				router.replace('/login');
			}
			toast({
				description: state.message,
				title: state?.success ? 'Success' : 'Error',
				variant: state?.success ? 'default' : 'destructive',
				duration: 5000,
			});
		}
	}, [state, router]);

	return (
		<div className={`grid gap-3 `}>
			<form action={formAction}>
				<div className='grid gap-3'>
					<div className='grid gap-2'>
						<div className='flex items-center'>
							<Label className='font-semibold text-[15px] '>Password</Label>
						</div>
						<Input
							type='password'
							name='password'
							placeholder='********'
							className={cn(
								'h-12 text-base placeholder:text-base ring-1 ring-transparent focus-visible:ring-1 focus-visible:ring-primary/40',
								state?.errors?.password
									? 'border-destructive focus-visible:border-destructive focus-visible:ring-destructive '
									: ''
							)}
							required
						/>
						<ErrorMessage errors={state?.errors?.password} />
					</div>
					<div className='grid gap-2'>
						<div className='flex items-center'>
							<Label className='font-semibold text-[15px] '>
								Confirm Password
							</Label>
						</div>
						<Input
							type='password'
							name='confirmPassword'
							placeholder='********'
							className={cn(
								'h-12 text-base placeholder:text-base ring-1 ring-transparent focus-visible:ring-1 focus-visible:ring-primary/40',
								state?.errors?.confirmPassword
									? 'border-destructive focus-visible:border-destructive focus-visible:ring-destructive '
									: ''
							)}
							required
						/>
						<ErrorMessage errors={state?.errors?.confirmPassword} />
					</div>
					<SubmitButton className='mt-2.5 w-full'>Send Reset Link</SubmitButton>
				</div>
			</form>
			<div className='relative'>
				<div className='absolute inset-0 flex items-center'>
					<span className='w-full border-t' />
				</div>
				<div className='relative flex justify-center text-xs uppercase'>
					<span className='bg-background px-2 text-muted-foreground'>
						Or continue with
					</span>
				</div>
			</div>
			<div className='grid gap-3 w-full'>
				<SignWithGoogle />
			</div>
		</div>
	);
}
