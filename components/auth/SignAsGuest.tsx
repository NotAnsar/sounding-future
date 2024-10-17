'use client';
import { loginGuest } from '@/actions/auth/login';
import Link from 'next/link';
import React from 'react';
import { useFormStatus } from 'react-dom';

export default function SignAsGuest() {
	return (
		<p className='px-8 text-center text-base font-semibold'>
			{'Or Just Join as a '}
			<Link
				href='/login-guest'
				className='text-primary-foreground hover:underline'
			>
				Test User
			</Link>
		</p>
	);
	return (
		<form
			className='px-8 text-center text-base font-semibold'
			action={loginGuest}
		>
			{'Or Just Join as a '}
			<SubmitButton />
		</form>
	);
}

function SubmitButton() {
	const { pending } = useFormStatus();
	return (
		<button
			type='submit'
			className='text-primary-foreground hover:underline'
			disabled={pending}
		>
			{pending ? 'Joining...' : 'Test User'}
		</button>
	);
}
