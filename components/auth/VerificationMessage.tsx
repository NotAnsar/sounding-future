import Link from 'next/link';

interface VerificationMessageProps {
	message: string;
}

export default function VerificationMessage({
	message,
}: VerificationMessageProps) {
	if (message && message.includes('verify your email')) {
		return (
			<div className='mt-2 '>
				<p className='text-sm font-medium'>{message}</p>
				<Link
					href='/resend-verification'
					className='text-sm text-primary-foreground font-semibold hover:underline mt-1 inline-block'
				>
					Resend verification email
				</Link>
			</div>
		);
	}

	return null;
}
