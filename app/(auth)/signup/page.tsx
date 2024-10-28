// import SignAsGuest from '@/components/auth/SignAsGuest';
import SignInForm from '@/components/auth/SignInForm';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
	title: 'Sounding Future | Sign Up',
	description: 'Sign in to have Access.',
};

export default async function Page() {
	return (
		<div className='lg:p-8 mt-12 md:mt-2'>
			<div className='mx-auto flex w-full flex-col justify-center gap-4 sm:min-w-[550px] lg:min-w-[475px] md:max-w-[75%] px-4 mt-10 overflow-y-auto h-full '>
				<div className='flex flex-col space-y-2 '>
					<h1 className='text-[42px] font-bold tracking-tight leading-[46px]'>
						Sign up for your account
					</h1>
					<p className='text-sm text-muted'>
						Enter your information to create an account
					</p>
				</div>

				<SignInForm />
				<div className='text-[15px] space-y-1.5'>
					<p className='px-8 text-center font-semibold mt-1.5'>
						{'Already have an account? '}
						<Link
							href='/login'
							className='text-primary-foreground hover:underline'
						>
							Login now
						</Link>
					</p>
					{/* <SignAsGuest /> */}

					<p className='text-[15px] text-muted text-center w-4/5 mx-auto'>
						By clicking continue, you agree to our{' '}
						<Link href={'/legal'} className='font-semibold hover:underline'>
							Legal Terms
						</Link>{' '}
						and{' '}
						<Link href={'/privacy'} className='font-semibold hover:underline'>
							Privacy Policy
						</Link>
						.
					</p>
				</div>
			</div>
		</div>
	);
}
