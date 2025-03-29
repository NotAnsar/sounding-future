import ResetForm from '@/components/auth/ResetForm';
import TermsAndPolicy from '@/components/auth/TermsAndPolicy';

import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
	title: 'Sounding Future | Reset Password',
	description: 'Reset Your Password.',
};

export default async function Page() {
	return (
		<div className='lg:p-8 mt-10 md:mt-0'>
			<div className='mx-auto flex w-full flex-col justify-center gap-4 sm:min-w-[550px] lg:min-w-[475px] md:max-w-[70%] px-4 mt-10 overflow-y-auto h-full '>
				<div className='flex flex-col space-y-2 '>
					<h1 className='text-[42px] font-bold tracking-tight leading-[46px]'>
						Reset Your Password
					</h1>
					<p className='text-sm text-muted'>
						{"You'll receive an email to recover your password"}
					</p>
				</div>

				<ResetForm />

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

					<TermsAndPolicy />
				</div>
			</div>
		</div>
	);
}
