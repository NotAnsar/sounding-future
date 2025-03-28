// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { verifyEmail } from '@/actions/auth/signup';
// import { toast } from '@/hooks/use-toast';

// export default function VerifyEmailPage({ token }: { token: string }) {
// 	const router = useRouter();
// 	const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
// 		'loading'
// 	);
// 	const [message, setMessage] = useState<string>('');

// 	useEffect(() => {
// 		if (!token) {
// 			setStatus('error');
// 			setMessage('Missing verification token');
// 			return;
// 		}

// 		// Directly verify the email with the token from props
// 		async function processVerification() {
// 			try {
// 				const result = await verifyEmail(token);
// 				if (result.success) {
// 					router.replace('/login');
// 				} else {
// 					setStatus('error');
// 					setMessage(result.message || 'Invalid verification token');
// 				}

// 				toast({
// 					description: result?.message || 'Invalid verification token',
// 					title: result?.success ? 'Success' : 'Error',
// 					variant: result?.success ? 'default' : 'destructive',
// 					duration: 5000,
// 				});
// 			} catch (error) {
// 				setStatus('error');
// 				setMessage('An error occurred during verification');
// 				console.error('Verification error:', error);
// 			}
// 		}

// 		processVerification();
// 	}, [token, router]);

// 	return (
// 		<div className='lg:p-8 mt-12 md:mt-2'>
// 			<div className='mx-auto flex w-full flex-col justify-center gap-4 sm:min-w-[550px] lg:min-w-[475px] md:max-w-[75%] px-4 mt-10 overflow-y-auto h-full'>
// 				<div className='flex flex-col space-y-2'>
// 					<h1 className='text-[42px] font-bold tracking-tight leading-[46px]'>
// 						Email Verification
// 					</h1>
// 					<p className='text-sm text-muted'>
// 						{status === 'loading' && 'Verifying your email address...'}
// 						{status === 'success' &&
// 							'Your email has been successfully verified.'}
// 						{status === 'error' &&
// 							'There was a problem with your verification.'}
// 					</p>
// 				</div>

// 				<div className='grid gap-6 mt-4'>
// 					{status === 'loading' && (
// 						<div className='flex flex-col items-center py-8'>
// 							<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4'></div>
// 							<p className='text-center'>Processing your verification</p>
// 						</div>
// 					)}

// 					{status === 'success' && (
// 						<div className='flex flex-col items-center py-6'>
// 							<div className='text-primary text-5xl mb-6'>✓</div>
// 							<p className='mb-6 text-center'>{message}</p>
// 							<p className='text-sm text-muted mb-4'>
// 								Redirecting you to login page...
// 							</p>
// 							<Link
// 								href='/login'
// 								className='text-primary-foreground hover:underline'
// 							>
// 								{"Click here if you're not redirected automatically"}
// 							</Link>
// 						</div>
// 					)}

// 					{status === 'error' && (
// 						<div className='flex flex-col items-center py-6'>
// 							<div className='text-destructive text-5xl mb-6'>✗</div>
// 							<p className='mb-6 text-center'>{message}</p>
// 							<div className='flex flex-col space-y-4 items-center'>
// 								<Link
// 									href='/resend-verification'
// 									className='text-primary-foreground hover:underline'
// 								>
// 									Resend verification email
// 								</Link>
// 								<Link
// 									href='/login'
// 									className='text-primary-foreground hover:underline'
// 								>
// 									Return to login
// 								</Link>
// 							</div>
// 						</div>
// 					)}
// 				</div>
// 			</div>
// 		</div>
// 	);
// }

'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { verifyEmail } from '@/actions/auth/signup';
import { toast } from '@/hooks/use-toast';

export default function VerifyEmailPage({ token }: { token: string }) {
	const router = useRouter();
	const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
		'loading'
	);
	const [message, setMessage] = useState<string>('');

	// Use a ref to prevent duplicate verification
	const verificationAttempted = useRef(false);

	useEffect(() => {
		// Check if verification has already been attempted
		if (verificationAttempted.current) {
			return;
		}

		if (!token) {
			setStatus('error');
			setMessage('Missing verification token');
			return;
		}

		// Set the flag to prevent duplicate attempts
		verificationAttempted.current = true;

		// Process verification
		async function processVerification() {
			try {
				const result = await verifyEmail(token);

				if (result.success) {
					setStatus('success');
					setMessage(result.message || 'Email verified successfully');

					toast({
						description: result.message || 'Email verified successfully',
						title: 'Success',
						variant: 'default',
						duration: 5000,
					});

					setTimeout(() => {
						router.push('/login');
					}, 2000);
				} else {
					setStatus('error');
					setMessage(result.message || 'Invalid verification token');

					toast({
						description: result.message || 'Invalid verification token',
						title: 'Error',
						variant: 'destructive',
						duration: 5000,
					});
				}
			} catch (error) {
				setStatus('error');
				setMessage('An error occurred during verification');
				console.error('Verification error:', error);

				toast({
					description: 'An error occurred during verification',
					title: 'Error',
					variant: 'destructive',
					duration: 5000,
				});
			}
		}

		processVerification();
	}, [token, router]);

	return (
		<div className='lg:p-8 mt-12 md:mt-2'>
			<div className='mx-auto flex w-full flex-col justify-center gap-4 sm:min-w-[550px] lg:min-w-[475px] md:max-w-[75%] px-4 mt-10 overflow-y-auto h-full'>
				<div className='flex flex-col space-y-2'>
					<h1 className='text-[42px] font-bold tracking-tight leading-[46px]'>
						Email Verification
					</h1>
					<p className='text-sm text-muted'>
						{status === 'loading' && 'Verifying your email address...'}
						{status === 'success' &&
							'Your email has been successfully verified.'}
						{status === 'error' &&
							'There was a problem with your verification.'}
					</p>
				</div>

				<div className='grid gap-6 mt-4'>
					{status === 'loading' && (
						<div className='flex flex-col items-center py-8'>
							<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4'></div>
							<p className='text-center'>Processing your verification</p>
						</div>
					)}

					{status === 'success' && (
						<div className='flex flex-col items-center py-6'>
							<div className='text-primary text-5xl mb-6'>✓</div>
							<p className='mb-6 text-center'>{message}</p>
							<p className='text-sm text-muted mb-4'>
								Redirecting you to login page...
							</p>
							<Link
								href='/login'
								className='text-primary-foreground hover:underline'
							>
								{"Click here if you're not redirected automatically"}
							</Link>
						</div>
					)}

					{status === 'error' && (
						<div className='flex flex-col items-center py-6'>
							<div className='text-destructive text-5xl mb-6'>✗</div>
							<p className='mb-6 text-center'>{message}</p>
							<div className='flex flex-col space-y-4 items-center'>
								<Link
									href='/resend-verification'
									className='text-primary-foreground hover:underline'
								>
									Resend verification email
								</Link>
								<Link
									href='/login'
									className='text-primary-foreground hover:underline'
								>
									Return to login
								</Link>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
