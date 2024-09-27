import LoginForm from '@/components/auth/LoginForm';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
	title: 'Sounding Future | Login',
	description: 'Login in to have Access.',
};

export default async function Page() {
	return (
		<div className='lg:p-8 mt-10 md:mt-0'>
			<div className='mx-auto flex w-full flex-col justify-center gap-4 sm:min-w-[550px] lg:min-w-[475px] md:max-w-[70%] px-4 mt-10 overflow-y-auto h-full '>
				<div className='flex flex-col space-y-2 '>
					<h1 className='text-[42px] font-bold tracking-tight leading-[46px]'>
						Login to your account
					</h1>
					<p className='text-sm text-muted'>
						Enter your email and password to access your account
					</p>
				</div>

				<LoginForm />
				<p className='px-8 text-center text-base font-semibold text-white mt-1.5'>
					{"Don't have an account? "}
					<Link href='/signup' className='text-primary hover:underline'>
						Sign up now
					</Link>
				</p>
			</div>
		</div>
	);
}
