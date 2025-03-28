'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { resendVerification } from '@/actions/auth/signup';
import { useFormState } from 'react-dom';
import { cn } from '@/lib/utils';
import ErrorMessage from '@/components/ErrorMessage';
import { SubmitButton } from '@/components/auth/SubmitButton';

// State type
interface ResendState {
	success?: boolean;
	message?: string;
}

// Wrapper function for useFormState compatibility
function resendEmailVerification(prevState: ResendState, formData: FormData) {
	const email = formData.get('email') as string;
	return resendVerification(email);
}

export default function ResendVerificationPage() {
	// Initial state for useFormState
	const initialState: ResendState = {};

	const [state, formAction] = useFormState(
		resendEmailVerification,
		initialState
	);

	return (
		<div className='lg:p-8 mt-12 md:mt-2'>
			<div className='mx-auto flex w-full flex-col justify-center gap-4 sm:min-w-[550px] lg:min-w-[475px] md:max-w-[75%] px-4 mt-10 overflow-y-auto h-full'>
				<div className='flex flex-col space-y-2'>
					<h1 className='text-[42px] font-bold tracking-tight leading-[46px]'>
						Resend Verification
					</h1>
					<p className='text-sm text-muted'>
						{state?.success
							? 'Verification email sent successfully'
							: 'Enter your email to receive a new verification link'}
					</p>
				</div>

				<div className='grid gap-2.5 mt-4'>
					{state?.success ? (
						<div className='flex flex-col items-center py-8'>
							<div className='text-primary text-5xl mb-6'>✓</div>
							<p className='mb-6 text-center'>{state.message}</p>
							<Link
								href='/login'
								className='text-primary-foreground hover:underline'
							>
								Return to login
							</Link>
						</div>
					) : (
						<form action={formAction}>
							<div className='grid gap-6'>
								<div className='grid gap-2'>
									<Label className='font-semibold text-[15px]'>Email</Label>
									<Input
										id='email'
										name='email'
										type='email'
										placeholder='name@example.com'
										required
										className={cn(
											'h-12 text-base placeholder:text-base ring-1 ring-transparent focus-visible:ring-1 focus-visible:ring-primary/40'
										)}
									/>
									<p className='text-sm text-muted'>
										Please enter the email address you used to sign up.
									</p>
								</div>

								{state?.success === false && (
									<ErrorMessage
										errors={[state.message || 'An error occurred']}
									/>
								)}

								<SubmitButton type='submit' className='w-full h-12'>
									Resend Verification Email
								</SubmitButton>

								<div className='text-[15px] text-center'>
									<p className='px-8 text-center font-semibold mt-1.5'>
										{'Remember your password? '}
										<Link
											href='/login'
											className='text-primary-foreground hover:underline'
										>
											Login now
										</Link>
									</p>
								</div>
							</div>
						</form>
					)}
				</div>
			</div>
		</div>
	);
}
