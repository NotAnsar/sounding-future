import UpdatePasswordForm from '@/components/auth/UpdateForm';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
	title: 'Sounding Future | Update Password',
	description: 'Update Your Password.',
};

export default async function Page({
	searchParams,
}: {
	searchParams: { token?: string };
}) {
	return (
		<div className='lg:p-8 mt-10 md:mt-0'>
			<div className='mx-auto flex w-full flex-col justify-center gap-4 sm:min-w-[550px] lg:min-w-[475px] md:max-w-[70%] px-4 mt-10 overflow-y-auto h-full '>
				<div className='flex flex-col space-y-2 '>
					<h1 className='text-[42px] font-bold tracking-tight leading-[46px]'>
						Update Your Password
					</h1>
					<p className='text-sm text-muted'>
						{'Please enter your new password to update your account. '}
					</p>
				</div>

				<UpdatePasswordForm token={searchParams.token || ''} />

				<div className=' space-y-1.5'>
					<p className='px-8 text-center font-semibold mt-1.5'>
						{'Need to login? '}
						<Link
							href='/login'
							className='text-primary-foreground hover:underline'
						>
							Click here
						</Link>
					</p>
					<p className='px-8 text-center font-semibold mt-1.5'>
						Forgot your password?{' '}
						<Link
							href='/reset-password'
							className='text-primary-foreground hover:underline'
						>
							Click here
						</Link>
					</p>

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
