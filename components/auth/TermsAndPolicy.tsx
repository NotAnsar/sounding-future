import Link from 'next/link';

export default function TermsAndPolicy() {
	return (
		<p className='text-[15px] text-muted text-center w-4/5 mx-auto'>
			By clicking continue, you agree to our{' '}
			<Link
				target='_blank'
				href={'/legal'}
				className='font-semibold hover:underline'
			>
				Legal Terms
			</Link>{' '}
			and{' '}
			<Link
				target='_blank'
				href={'/privacy'}
				className='font-semibold hover:underline'
			>
				Privacy Policy
			</Link>
			.
		</p>
	);
}
