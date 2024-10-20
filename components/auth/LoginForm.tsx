'use client';

import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFormState } from 'react-dom';
import { login } from '@/actions/auth/login';
import ErrorMessage from '../ErrorMessage';
import { SubmitButton } from './SubmitButton';
import { cn } from '@/lib/utils';
import SignWithGoogle from './SignWithGoogle';

export default function LoginForm() {
	const [state, formAction] = useFormState(login, {});

	return (
		<div className={`grid gap-4 `}>
			<form action={formAction}>
				<div className='grid gap-4'>
					<div className='grid gap-2'>
						<Label className='font-semibold text-[15px]'>Email</Label>
						<Input
							type='email'
							name='email'
							placeholder='name@example.com'
							className={cn(
								'h-12 text-base placeholder:text-base ring-1 ring-transparent focus-visible:ring-1 focus-visible:ring-primary/40',
								state?.errors?.email
									? 'border-destructive focus-visible:border-destructive focus-visible:ring-destructive '
									: ''
							)}
							required
						/>

						<ErrorMessage errors={state?.errors?.email} />
					</div>
					<div className='grid gap-2'>
						<div className='flex items-center'>
							<Label className='font-semibold text-[15px] '>Password</Label>
							<Link
								href='#'
								className='ml-auto inline-block text-[15px] text-primary-foreground underline font-semibold '
							>
								Forgot password?
							</Link>
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

					<div>
						<ErrorMessage
							errors={state?.message ? [state.message] : undefined}
						/>
						<SubmitButton className='mt-2.5 w-full'>
							Login With Email
						</SubmitButton>
					</div>
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
