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
				<p className='px-8 text-center text-base font-semibold mt-1.5'>
					{'Already have an account? '}
					<Link
						href='/login'
						className='text-primary-foreground hover:underline'
					>
						Login now
					</Link>
				</p>
			</div>
		</div>
	);
}
